from flask import Flask, request
import dropbox
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Paste your Dropbox access token here
TOKEN = "sl.u.AGzcqQhRNZbVsvrLdLQWcHq22CH9uoo4nOGYSCfTe26P3MOb3zrJZuhle_FPZHxP7ne2KGe6FHWbZlbn3aLT0PWvNBTmN2AtTmGxHCo7mt0QB3Z4WTOZKIt4g7-BggtS_sbF2Uhj2MCWAWhKYBJLtkq3S4zKOgYtesHKmHtMIH1J8bdDsfYTWnaiGOMV0bvk_ZZUSMI_3AvlS3Kc5znHZUgMZ5Z6GTg71jqkrobUveoeZn1MQvlaJIyFDk5wrlsCnCo5n6V8GmHAMhDuvkHRF31CNFiwhaYjXlxCscpbTQr6mBzGb-Go3MvAjL8l_olyXlPzSkyAeRjsgmqGMIUuxc1mM76cRpsZhdRtUA3Q3iROsCJo6Sc9_M21-Nzv7Z434CgxRQY1H3fzT31BYAKpEdpnPMf_IRQI_zelmHJcnGykRN1hINe-EAmf6Jb9GhrSwLVQKXNtmHHBLolsq4ICpWlLxb-KGzrHRFuRk8_f4I-hLhaKmGlDsjNJQVc2398buwbr6E5n3a-tjItshw641qWdSyxuC9g6KX5cdQ6Z6zxGTPI845ZGH1kljnReCLlDOMagKc5XsFwEY0PJRs31d5zWjZ0OB7miG7neKh42-fus0M8gqeVc24rKF0TYSZS0r-Fz_bmncASugxXQAx1aovoi4Ocd2W1Tcbt0C3QOTEwJq2GmbN1CTMVJlu6j7frL9rItV_1mNSgPQd7HhMIQyb841ZLyhyOREdL5kCUVdwBYCabYoRa-Cus0wVxzPvvevSCTgPmD1k6JYHLSxD6yy2c95QRNgs-V1mM3j8cG_YYfRCLceu9dduyC4KZp5XqjDWHN99o0lWLHwcQ-aNCqP70nCKycdyP-ZWi4JaWOjlg9_q6vYQmSmMKrCCJeb3lgmnxgucvKhRGWff7vo0zyYfeaRNWv7Wmcfy4yohLl6hPb3uHGJUyQ7L32YAqLS46sd1quoBe8WK0KqP5TFqnxbIqvPUFrD9CuAvE9DNe__S6ZMR6wDPRZ_kr-Gw6l6YJFmoEUN3061mB8tRZRyW-OJmWTVQDEKZktkmaHOEHFx4i2gb1IeELfgHVSWQH2Lr8MclPGsNhI8ONvrNoVUifF29RC_g9nLU63NlMoEydD50x7rmJZz2wjMhRqjrPSwdAW-ERqeLHLKtrTq_Fy865ddRR75GiWPQB87EJdfBSEhUd_heMAeOO9OI5ttn38NlhdB7FGIxUkYI6Cq35XbgwSTMHiLMVHi37Hpco4p5syiVPTAR7vvtGCRNvmFYUwEyir9_M-Kjbbhb9yqzidcruGKZPD6TGPlRCqNsv5ynRg6TF0-kXEwg5q3R0kJi4XT59OapMi9AL0HgsBGDHjY3sP_wnyiZGB6vqDlvZWVDXK0insokSgbx2QodC-lUcrgeDnMJUnuYGDWwrJDs6Tvjj5fOoh8k4cSWx59hVudfla5XS54PNHVDUfkprDpRXPyEZCL9o"

dbx = dropbox.Dropbox(TOKEN)


@app.route("/")
def home():
    return open("index.html").read()


@app.route("/submit", methods=["POST"])
def submit():

    name = request.form["name"]
    email = request.form["email"]
    job = request.form["job"]

    file = request.files.get("file")

    if not file or not file.filename:
        return "Please select a file.", 400

    filename = secure_filename(file.filename)

    if not filename:
        return "Invalid filename.", 400

    # Upload the selected file to Dropbox
    dbx.files_upload(
        file.read(),
        "/" + filename,
        mode=dropbox.files.WriteMode.overwrite
    )

    # Save application details
    data = f"Name: {name}\nEmail: {email}\nJob: {job}"

    dbx.files_upload(
        data.encode("utf-8"),
        "/application.txt",
        mode=dropbox.files.WriteMode.overwrite
    )

    return """
    <h2>Application Submitted Successfully!</h2>
    <p>Your details and file have been uploaded to Dropbox.</p>
    <a href="/">Go Back</a>
    """


if __name__ == "__main__":
    app.run(debug=True)