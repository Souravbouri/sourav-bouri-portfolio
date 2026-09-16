import os
import re
import smtplib
import ssl
import time
from collections import deque
from email.message import EmailMessage

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request


load_dotenv()

app = Flask(__name__)


# ==================================================
# MAIL CONFIG
#
# All of this lives server-side only, read from
# environment variables (see .env.example). Your
# real inbox address never touches the HTML, JS,
# or any response sent to the browser.
# ==================================================

MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")
MAIL_TO = os.environ.get("MAIL_TO") or MAIL_USERNAME
SMTP_HOST = os.environ.get("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))

EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

MAX_LENGTHS = {
    "name": 120,
    "email": 180,
    "subject": 150,
    "message": 4000,
}


# ==================================================
# very small in-memory rate limiter
#
# Not meant to replace a real WAF/captcha -- just
# stops the same visitor from hammering the form.
# Resets whenever the server restarts.
# ==================================================

RATE_LIMIT_WINDOW_SECONDS = 600
RATE_LIMIT_MAX_REQUESTS = 5
_recent_requests_by_ip = {}


def is_rate_limited(ip_address):

    now = time.time()

    timestamps = _recent_requests_by_ip.setdefault(
        ip_address, deque()
    )

    while timestamps and now - timestamps[0] > RATE_LIMIT_WINDOW_SECONDS:
        timestamps.popleft()

    if len(timestamps) >= RATE_LIMIT_MAX_REQUESTS:
        return True

    timestamps.append(now)

    return False


# ==================================================
# ROUTES
# ==================================================

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/contact", methods=["POST"])
def contact():

    payload = request.get_json(silent=True) or request.form

    # Honeypot field -- real visitors never see or fill this
    # (hidden off-screen in the CSS). If it's filled, it's a bot;
    # pretend success so the bot doesn't learn to try harder.
    if (payload.get("company") or "").strip():
        return jsonify({"ok": True})

    client_ip = request.headers.get(
        "X-Forwarded-For", request.remote_addr or "unknown"
    ).split(",")[0].strip()

    if is_rate_limited(client_ip):
        return jsonify({
            "ok": False,
            "error": "Too many messages sent recently. Please try again in a few minutes.",
        }), 429

    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip()
    subject = (payload.get("subject") or "").strip()
    message = (payload.get("message") or "").strip()

    if not name or not email or not subject or not message:
        return jsonify({"ok": False, "error": "Please fill in every field."}), 400

    for field, value in (("name", name), ("email", email), ("subject", subject), ("message", message)):
        if len(value) > MAX_LENGTHS[field]:
            return jsonify({"ok": False, "error": f"Your {field} is too long."}), 400

    if not EMAIL_PATTERN.match(email):
        return jsonify({"ok": False, "error": "Please enter a valid email address."}), 400

    if not MAIL_USERNAME or not MAIL_PASSWORD:
        # Server isn't configured with credentials yet.
        app.logger.warning("Contact form used but MAIL_USERNAME/MAIL_PASSWORD are not set.")
        return jsonify({
            "ok": False,
            "error": "The contact form isn't fully set up yet. Please reach out via GitHub or LinkedIn instead.",
        }), 503

    try:
        send_contact_email(name, email, subject, message)
    except Exception:
        app.logger.exception("Failed to send contact email")
        return jsonify({
            "ok": False,
            "error": "Something went wrong sending your message. Please try again shortly.",
        }), 502

    return jsonify({"ok": True})


def send_contact_email(name, email, subject, message):

    email_message = EmailMessage()

    email_message["Subject"] = f"Portfolio contact: {subject}"
    email_message["From"] = MAIL_USERNAME
    email_message["To"] = MAIL_TO
    email_message["Reply-To"] = email

    email_message.set_content(
        "New message from your portfolio site.\n\n"
        f"Name: {name}\n"
        f"Email: {email}\n"
        f"Subject: {subject}\n\n"
        "Message:\n"
        f"{message}\n"
    )

    context = ssl.create_default_context()

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:
        server.starttls(context=context)
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        server.send_message(email_message)


if __name__ == "__main__":
    app.run(debug=True)
