from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
from dotenv import load_dotenv
import os
import secrets
import werkzeug
import json
import cloudinary
import cloudinary.uploader


# ===== LOAD ENV =====
load_dotenv()

app = Flask(__name__)
CORS(app)

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

BREVO_API_KEY = os.getenv("BREVO_API_KEY")

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

        url = "https://api.brevo.com/v3/smtp/email"

        headers = {
            "accept": "application/json",
            "api-key": BREVO_API_KEY,
            "content-type": "application/json"
        }

        payload = {
            "sender": {
                "name": "Portfolio Website",
                "email": "yadavbimleshnarayan98@gmail.com"
            },

            "to": [
                {
                    "email": "yadavbimleshnarayan98@gmail.com",
                    "name": "Bimlesh"
                }
            ],

           "subject": data.get("subject", f"New Contact From {data['name']}"),

            "htmlContent": f"""
            <h2>New Contact Form</h2>

            <b>Name:</b> {data['name']} <br><br>

            <b>Email:</b> {data['email']} <br><br>

            <b>Message:</b><br>

            {data['message']}
            """
        }

        response = requests.post(
            url,
            json=payload,
            headers=headers
        )

        if response.status_code == 201:
            return jsonify({"success": True})

        return jsonify({
    "success": False,
    "status": response.status_code,
    "error": response.text
}), response.status_code

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        })
# ================= RESUME =================
@app.route("/upload-resume", methods=["POST"])
def upload_resume():
    try:
        file = request.files["file"]

        if not file:
            return jsonify({"success": False, "error": "No file"})

        upload_result = cloudinary.uploader.upload(
    file,
    resource_type="raw",
    folder="portfolio/resume",
    use_filename=True,
    unique_filename=False,
    overwrite=True
)
        print(upload_result)

        resume_data = {
            "resume": upload_result["secure_url"]
        }

        with open("resume.json", "w") as f:
            json.dump(resume_data, f, indent=4)

        return jsonify({"success": True})

    except Exception as e:
        print("RESUME ERROR:", e)
        return jsonify({"success": False, "error": str(e)}), 500
    
@app.route("/download-resume")
def download_resume():
    try:
        if not os.path.exists("resume.json"):
            return jsonify({"error": "No resume"})

        with open("resume.json", "r") as f:
            resume_data = json.load(f)

        return jsonify({
            "url": resume_data["resume"]
        })

    except Exception as e:
        print("DOWNLOAD ERROR:", e)
        return jsonify({"error": "No resume"})
    
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

        # Upload image to Cloudinary
        if file:
            upload_result = cloudinary.uploader.upload(
                file,
                folder="portfolio/projects"
            )
            filename = upload_result["secure_url"]

        # Upload PPT to Cloudinary
        if ppt:
            ppt_result = cloudinary.uploader.upload(
    ppt,
    resource_type="raw",
    folder="portfolio/ppt",
    public_id=os.path.splitext(ppt.filename)[0],
    format="pptx",
    overwrite=True
)

            ppt_name = ppt_result["secure_url"]

        project = {
            "id": max([p["id"] for p in projects], default=0) + 1,
            "title": request.form.get("title"),
            "description": request.form.get("description"),
            "github": request.form.get("github"),
            "live": request.form.get("live"),
            "image": filename,
            "ppt": ppt_name
        }

        projects.append(project)
        save_projects(projects)

        return jsonify({"success": True})

    except Exception as e:
        print("UPLOAD ERROR:", e)
        return jsonify({"success": False})
    
# ================= EDIT PROJECT =================
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

                # Upload new image to Cloudinary
                file = request.files.get("image")
                if file:
                    upload_result = cloudinary.uploader.upload(
                        file,
                        folder="portfolio/projects"
                    )
                    p["image"] = upload_result["secure_url"]

                # Upload new PPT to Cloudinary
                ppt = request.files.get("ppt")
                if ppt:
                    ppt_result = cloudinary.uploader.upload(
                        ppt,
                        resource_type="raw",
                        folder="portfolio/ppt"
                    )
                    p["ppt"] = ppt_result["secure_url"]

                break

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
        return jsonify({"error": "Not allowed"}), 403

    reset_token = secrets.token_hex(16)

    FRONTEND_URL = "https://my-portfolio-web-u9sr.vercel.app"

    reset_link = f"{FRONTEND_URL}/reset/{reset_token}"

    url = "https://api.brevo.com/v3/smtp/email"

    headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json"
    }

    payload = {
        "sender": {
            "name": "Portfolio Website",
            "email": "yadavbimleshnarayan98@gmail.com"
        },
        "to": [
            {
                "email": email,
                "name": "Admin"
            }
        ],
        "subject": "Reset Password",
        "htmlContent": f"""
        <h2>Password Reset</h2>

        <p>Click the button below to reset your password.</p>

        <p>
            <a href="{reset_link}"
               style="
                    background:#f59e0b;
                    color:white;
                    padding:10px 18px;
                    text-decoration:none;
                    border-radius:6px;">
                Reset Password
            </a>
        </p>

        <p>Or copy this link:</p>

        <p>{reset_link}</p>
        """
    }

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == 201:
        return jsonify({"success": True})

    return jsonify({
        "success": False,
        "status": response.status_code,
        "error": response.text
    }), response.status_code

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

    # Upload certificate to Cloudinary
    upload_result = cloudinary.uploader.upload(
        file,
        folder="portfolio/certificates"
    )

    certificates.append({
        "id": len(certificates) + 1,
        "title": title,
        "file": upload_result["secure_url"]
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

# @app.route("/uploads/certificates/<filename>")
# def certificate_file(filename):

#     return send_from_directory(
#         CERTIFICATE_FOLDER,
#         filename
#     )

# ===== RUN =====
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)