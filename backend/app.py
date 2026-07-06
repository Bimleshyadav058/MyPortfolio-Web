from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_mail import Mail, Message
from dotenv import load_dotenv
import os
import secrets
import werkzeug
import json


# ===== LOAD ENV =====
load_dotenv()

app = Flask(__name__)
CORS(app)

# ===== MAIL CONFIG =====
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv("MAIL_USER")
app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASS")

mail = Mail(app)

# ===== ADMIN =====
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
new_admin_password = ADMIN_PASSWORD

reset_token = ""

# ===== FOLDERS =====
UPLOAD_FOLDER = "uploads"
RESUME_FOLDER = os.path.join(UPLOAD_FOLDER, "resume")
PROJECT_FOLDER = os.path.join(UPLOAD_FOLDER, "projects")
CERTIFICATE_FOLDER = os.path.join(UPLOAD_FOLDER, "certificates")
PPT_FOLDER = os.path.join(UPLOAD_FOLDER, "ppt")
DATA_FILE = "projects.json"

os.makedirs(RESUME_FOLDER, exist_ok=True)
os.makedirs(PROJECT_FOLDER, exist_ok=True)
os.makedirs(CERTIFICATE_FOLDER, exist_ok=True)
os.makedirs(PPT_FOLDER, exist_ok=True)

# ===== CREATE JSON FILE =====
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, "w") as f:
        json.dump([], f)

# ================= ADMIN LOGIN =================
@app.route("/admin-login", methods=["POST"])
def admin_login():

    global new_admin_password
    
    data = request.get_json()
    return jsonify({"success": data.get("password") == new_admin_password})

# ================= CONTACT =================
@app.route("/contact", methods=["POST"])
def contact():
    try:
        data = request.get_json()

        msg = Message(
            subject=f"New Contact from {data.get('name')}",
            sender=os.getenv("MAIL_USER"),
            recipients=[os.getenv("MAIL_USER")]
        )

        msg.body = f"""
Name: {data.get('name')}
Email: {data.get('email')}

Message:
{data.get('message')}
"""

        mail.send(msg)
        return jsonify({"success": True})

    except Exception as e:
        print("MAIL ERROR:", e)
        return jsonify({"success": False})

# ================= RESUME =================
@app.route("/upload-resume", methods=["POST"])
def upload_resume():
    try:
        file = request.files["file"]

        if not file:
            return jsonify({"success": False, "error": "No file"})

        filepath = os.path.join(RESUME_FOLDER, "resume.pdf")
        file.save(filepath)

        return jsonify({"success": True})

    except Exception as e:
        print("RESUME ERROR:", e)
        return jsonify({"success": False})

@app.route("/download-resume")
def download_resume():
    filepath = os.path.join(RESUME_FOLDER, "resume.pdf")

    if not os.path.exists(filepath):
        return jsonify({"error": "No resume"})

    return send_from_directory(RESUME_FOLDER, "resume.pdf")

# ================= IMAGE SERVE =================
@app.route('/uploads/projects/<filename>')
def project_image(filename):
    return send_from_directory(PROJECT_FOLDER, filename)

# ================= PPT SERVE =================Uload projects
@app.route('/uploads/ppt/<path:filename>')
def project_ppt(filename):
    return send_from_directory(PPT_FOLDER, filename, as_attachment=False)



# ================= JSON HELPERS =================
def load_projects():
    try:
        with open(DATA_FILE, "r") as f:
            content = f.read()

            if content.strip() == "":
                return []

            return json.loads(content)

    except Exception as e:
        print("LOAD ERROR:", e)
        return []

def save_projects(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)


CERTIFICATE_FILE = "certificates.json"

if not os.path.exists(CERTIFICATE_FILE):
    with open(CERTIFICATE_FILE, "w") as f:
        json.dump([], f)

        # ================= GET PROJECTS =================
@app.route("/projects", methods=["GET"])
def get_projects():
    try:
        projects = load_projects()
        return jsonify(projects)

    except Exception as e:
        print("GET PROJECT ERROR:", e)
        return jsonify([])
    
    


# ================= PROJECT =================

@app.route("/upload-project", methods=["POST"])
def upload_project():
    try:
        projects = load_projects()

        file = request.files.get("image")
        ppt = request.files.get("ppt")
        filename = None
        ppt_name = None

      
        

        if file:
            filename = werkzeug.utils.secure_filename(file.filename)
            filepath = os.path.join(PROJECT_FOLDER, filename)
            file.save(filepath)

        if ppt:
            ppt_name = werkzeug.utils.secure_filename(ppt.filename)
            ppt_path = os.path.join(PPT_FOLDER, ppt_name)
            ppt.save(ppt_path)

        project = {
            "id": max([p["id"] for p in projects], default=0) + 1,
            "title": request.form.get("title"),
            "description": request.form.get("description"),
            "github": request.form.get("github"),
            "live": request.form.get("live"),
            "image": f"http://127.0.0.1:5000/uploads/projects/{filename}" if filename else None,
            "ppt": f"http://127.0.0.1:5000/uploads/ppt/{ppt_name}" if ppt_name else None
        }

        projects.append(project)
        save_projects(projects)

        return jsonify({"success": True})

    except Exception as e:
        print("UPLOAD ERROR:", e)
        return jsonify({"success": False})

# ================= EDIT =================projects
@app.route("/edit-project/<int:id>", methods=["PUT"])
def edit_project(id):
    try:
        projects = load_projects()

        for p in projects:
            if p["id"] == id:
                p["title"] = request.form.get("title")
                p["description"] = request.form.get("description")
                p["github"] = request.form.get("github")
                p["live"] = request.form.get("live")

                file = request.files.get("image")
                if file:
                    filename = werkzeug.utils.secure_filename(file.filename)
                    filepath = os.path.join(PROJECT_FOLDER, filename)
                    file.save(filepath)
                    p["image"] = f"http://127.0.0.1:5000/uploads/projects/{filename}"

                ppt = request.files.get("ppt")
                if ppt:
                    ppt_name = werkzeug.utils.secure_filename(ppt.filename)
                    ppt_path = os.path.join(PPT_FOLDER, ppt_name)
                    ppt.save(ppt_path)
                    p["ppt"] = f"http://127.0.0.1:5000/uploads/ppt/{ppt_name}"

        save_projects(projects)
        return jsonify({"success": True})

    except Exception as e:
        print("EDIT ERROR:", e)
        return jsonify({"success": False})

# ================= DELETE =================
@app.route("/delete-project/<int:id>", methods=["DELETE"])
def delete_project(id):
    try:
        projects = load_projects()
        projects = [p for p in projects if p["id"] != id]
        save_projects(projects)
        return jsonify({"success": True})
    except Exception as e:
        print("DELETE ERROR:", e)
        return jsonify({"success": False})

# ================= FORGOT PASSWORD =================
@app.route("/forgot-password", methods=["POST"])
def forgot_password():
    global reset_token

    email = request.json.get("email")

    if email != os.getenv("MAIL_USER"):
        return jsonify({"error": "Not allowed"})

    reset_token = secrets.token_hex(16)
    new_admin_password = ADMIN_PASSWORD

    msg = Message(
        "Reset Password",
        sender=os.getenv("MAIL_USER"),
        recipients=[email],
        body=f"http://localhost:5173/reset/{reset_token}"
    )


    mail.send(msg)

    return jsonify({"success": True})

# ========== Reset API PASSWORD =================
@app.route("/reset-password/<token>", methods=["POST"])
def reset_password(token):

    global reset_token
    global new_admin_password

    try:

        if token != reset_token:
            return jsonify({
                "success": False,
                "error": "Invalid token"
            })

        data = request.get_json()

        new_password = data.get("password")

        if not new_password:
            return jsonify({
                "success": False
            })

        new_admin_password = new_password

        reset_token = ""

        return jsonify({
            "success": True
        })

    except Exception as e:
        print("RESET ERROR:", e)

        return jsonify({
            "success": False
        })

# ================= CERTIFICATES =================

CERTIFICATE_FILE = "certificates.json"

@app.route("/upload-certificate", methods=["POST"])
def upload_certificate():

    with open(CERTIFICATE_FILE, "r") as f:
        certificates = json.load(f)

    title = request.form.get("title")

    file = request.files.get("file")

    if not file:
        return jsonify({"success": False})

    filename = werkzeug.utils.secure_filename(file.filename)

    file.save(
        os.path.join(CERTIFICATE_FOLDER, filename)
    )

    certificates.append({
        "id": len(certificates) + 1,
        "title": title,
        "file": f"http://127.0.0.1:5000/uploads/certificates/{filename}"
    })

    with open(CERTIFICATE_FILE, "w") as f:
        json.dump(certificates, f, indent=2)

    return jsonify({"success": True})


@app.route("/certificates", methods=["GET"])
def get_certificates():

    with open(CERTIFICATE_FILE, "r") as f:
        return jsonify(json.load(f))


@app.route("/delete-certificate/<int:id>", methods=["DELETE"])
def delete_certificate(id):

    with open(CERTIFICATE_FILE, "r") as f:
        certificates = json.load(f)

    certificates = [
        c for c in certificates
        if c["id"] != id
    ]

    with open(CERTIFICATE_FILE, "w") as f:
        json.dump(certificates, f, indent=2)

    return jsonify({"success": True})


@app.route("/uploads/certificates/<filename>")
def certificate_file(filename):

    return send_from_directory(
        CERTIFICATE_FOLDER,
        filename
    )

# ===== RUN =====
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)