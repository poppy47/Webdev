from flask import Flask , request, render_template, redirect, url_for , session 
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///placement_portal.db'
app.config['SECRET_KEY'] = "my-secret-key"

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), unique=True, nullable=False)
    email = db.Column(db.String(60), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    is_blocked = db.Column(db.Boolean, default = False)
    student = db.relationship("Student", backref="user", uselist=False)
    company = db.relationship("Company", backref="user", uselist=False)


class Student(db.Model):
    __tablename__ = "students"
    id = db.Column(db.Integer, primary_key=True)
    department = db.Column(db.String(60), nullable = False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), unique=True, nullable=False)
    name = db.Column(db.String(30), nullable=False)
    resume = db.Column(db.String(255)) 
    applications = db.relationship("Application", backref="student", lazy=True)


class Company(db.Model):
    __tablename__ = "companies"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), unique=True, nullable=False)
    name = db.Column(db.String(50), nullable=False , unique = True)
    website = db.Column(db.String(255), unique=True, nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    drives = db.relationship("PlacementDrive", backref="company", lazy=True)


class PlacementDrive(db.Model):
    __tablename__ = "placement_drives"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String() ,unique = True ,  nullable = False)
    job_title = db.Column(db.String(60), nullable=False)
    eligibility = db.Column(db.String(100), nullable = False)
    job_description = db.Column(db.Text, nullable = False)
    deadline = db.Column(db.String(), nullable=False)
    is_completed = db.Column(db.Boolean, default = False)
    company_id = db.Column(db.Integer, db.ForeignKey("companies.id"), nullable=False)
    applications = db.relationship("Application", backref="drive", lazy=True)
    


class Application(db.Model):
    __tablename__ = "applications"
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("students.id"), nullable=False)
    drive_id = db.Column(db.Integer, db.ForeignKey("placement_drives.id"), nullable=False)
    status = db.Column(db.String(20), default="notapplied")
    __table_args__ = (
        db.UniqueConstraint("student_id", "drive_id", name="unique_student_drive"),
    )

db.init_app(app)

@app.route("/", methods = ["GET"])
def home():
    return render_template("home.html")


@app.route("/company_registration", methods = ["GET", "POST"])
def company_registration(): 
    if request.method == "POST": 
        name = request.form.get("name") 
        website = request.form.get("website")
        email = request.form.get("email") 
        username = request.form.get("username") 
        password = request.form.get("password") 
        existing_user = User.query.filter((User.username == username) | (User.email == email)).first() 
        if existing_user: 
            message = "user alredy exist"
            return render_template("com_registration.html", message = message)
        user = User(username = username, password = password, email = email, role = "company")
        db.session.add(user) 
        db.session.commit() 
        company = Company(name = name, website = website, is_verified = False , user_id = user.id)
        db.session.add(company) 
        db.session.commit() 
        return redirect(url_for("login"))
    return render_template("com_registration.html")
    
@app.route("/student_registration", methods = ["GET", "POST"])
def student_registration():
    if request.method == "POST": 
        name = request.form.get("name") 
        department = request.form.get("department") 
        email = request.form.get("email") 
        username = request.form.get("username") 
        password = request.form.get("password") 
        resume = request.form.get("resume")
        existing_user = User.query.filter((User.username == username ) | (User.email == email)).first() 
        if existing_user: 
            message = "user already exists."
            return render_template("stu_registration.html", message = message)
        user = User(username = username,email = email,  password = password, role = "student")
        db.session.add(user) 
        db.session.commit()
        student = Student(name = name,user_id = user.id ,department = department,resume = resume)
        db.session.add(student)
        db.session.commit()
        return redirect(url_for('login'))
    return render_template("stu_registration.html") 

@app.route("/login", methods = ["GET", "POST"])
def login():
    if request.method == "POST": 
        username = request.form.get("username") 
        password = request.form.get("password") 
        user = User.query.filter_by(username=username).first()
        if user and user.password == password: 
            if user.is_blocked == False: 
                session["user_id"] = user.id 
                session["role"] = user.role 
                if user.role == "admin": 
                    return redirect(url_for("admin_dash"))
                elif user.role == "student":
                    return redirect(url_for('stu_dashboard'))
                elif user.role == "company": 
                    return redirect(url_for('com_dash'))
            else: 
                return "your account is blocked.Please Contect admin."
        else: 
            return render_template("login.html" , message = "You entered the wrong credentials . please try again")
    return render_template("login.html")

@app.route("/stu_dash", methods = ["GET", "POST"])
def stu_dashboard(): 
    user_id = session.get("user_id")
    if user_id is None: 
        return render_template("login.html", message = "unauthorize access") 
    student = Student.query.filter_by(user_id = user_id).first() 
    companies = Company.query.all() 
    applications = Application.query.filter_by( student_id = student.id ) 
    return render_template("stu_dashboard.html", student = student,companies = companies , applications = applications)

@app.route("/stu_com_detail/<int:id>", methods = ["GET", "POST"]) 
def com_details(id): 
    company = Company.query.get(id) 
    drives = PlacementDrive.query.filter_by(company_id = id)  
    return render_template("stu_com_details.html", company = company, drives = drives) 

@app.route("/stu_drive_details/<int:id>", methods = ["GET", "POST"])
def stu_drive_details(id): 
    user_id = session.get("user_id") 
    user = User.query.get(user_id)
    student = Student.query.filter_by(user_id = user.id).first() 
    drive = PlacementDrive.query.get(id)
    application = Application.query.filter_by(drive_id = drive.id , student_id = student.id ).first() 
    return render_template("stu_drive_details.html" , drive = drive, application = application, user = user)

@app.route("/apply_drive/<int:id>", methods = ["GET", "POST"]) 
def apply(id): 
    user_id = session.get("user_id")
    drive = PlacementDrive.query.get(id) 
    student = Student.query.filter_by(user_id = user_id).first()
    status = "Applied" 
    application = Application( student_id = student.id , drive_id = drive.id , status = status)
    db.session.add(application) 
    db.session.commit() 
    return redirect(url_for("stu_dashboard"))


@app.route("/edit_profile/<int:id>", methods = ["GET", "POST"])
def edit_profile(id): 
    if request.method == "POST": 
        name = request.form.get('name') 
        department = request.form.get('department') 
        email = request.form.get('email') 
        resume = request.form.get('resume') 
        username = request.form.get('username') 
        password = request.form.get('password') 
        student = Student.query.get(id) 
        student.name = name 
        student.department = department 
        student.resume = resume 
        user = User.query.get(student.user_id) 
        user.username = username
        user.password = password 
        user.email = email
        db.session.commit() 
        return redirect(url_for('stu_dashboard'))
    student = Student.query.get(id) 
    user = User.query.get(student.user_id)
    return render_template("stu_edit_profile.html", student = student , user = user)

#compnay 
@app.route("/com_dashboard", methods = ["GET", "POST"]) 
def com_dash(): 
    user_id = session.get("user_id")
    if user_id is None : 
        return render_template("login.html", message = "unauthourize access")
    company = Company.query.filter_by(user_id = user_id).first() 
    drives = PlacementDrive.query.filter_by(company_id = company.id)
    return render_template("com_dashboard.html", company = company, drives = drives)

@app.route("/drive_details/<int:id>", methods = ["GET", "POST"])  
def drive_details(id): 
    drive = PlacementDrive.query.get(id)
    applications = Application.query.filter_by(drive_id = drive.id).all() 
    students = Student.query.all() 
    return render_template("com_drive_details.html", drive = drive, applications = applications, students = students)

@app.route("/create_drive/<int:id>" , methods = ["GET", "POST"]) 
def create_drive(id): 
    if request.method == "POST": 
        name = request.form.get("name") 
        job_title = request.form.get("job_title") 
        job_description = request.form.get("job_description") 
        eligibility = request.form.get("eligibility")
        deadline = request.form.get("deadline") 
        company = Company.query.get(id)
        drive = PlacementDrive(name = name , job_title = job_title, job_description = job_description, eligibility = eligibility, deadline = deadline , company_id = id) 
        drives = PlacementDrive.query.all() 
        if company.is_verified: 
            if drive not in drives: 
                db.session.add(drive) 
                db.session.commit()
                return redirect(url_for("com_dash"))
            else: 
                message = "Drive is already there." 
        else: 
            return "You are not verified to create a drive please contact admin."
    return render_template("com_create_drive.html")

@app.route("/review_application/<int:id>", methods = ["GET", "POST"]) 
def review_application(id): 
    application = Application.query.get(id) 
    student = Student.query.filter_by(id = application.student_id).first() 
    drive = PlacementDrive.query.filter_by( id = application.drive_id ).first() 
    return render_template('com_stu_application.html', student = student, drive = drive, application = application)

@app.route('/select/<int:id>', methods = ["GET", "POST"]) 
def select(id): 
    application = Application.query.get(id) 
    application.status = "Selected" 
    db.session.commit() 
    return render_template('com_stu_application.html', student = application.student, drive = application.drive, application = application)  

@app.route('/reject/<int:id>', methods = ["GET", "POST"]) 
def reject(id): 
    application = Application.query.get(id) 
    application.status = "Rejected" 
    db.session.commit() 
    return render_template('com_stu_application.html', student = application.student, drive = application.drive, application = application) 

@app.route('/mark_complete/<int:id>', methods = ["GET", "POST"] ) 
def mark_complete(id): 
    drive = PlacementDrive.query.get(id) 
    drive.is_completed = True 
    db.session.commit() 
    user_id = session.get("user_id") 
    user = User.query.get(user_id) 
    if user.role == "admin": 
        return redirect(url_for('admin_dash')) 
    else: 
        return redirect(url_for('com_dash')) 


#admin 
@app.route("/admin_dashboard" , methods = ["GET" , "POST"]) 
def admin_dash():
    companies = Company.query.all() 
    students = Student.query.all()  
    user = User.query.all()
    drives = PlacementDrive.query.all() 
    applications = Application.query.all() 
    if "user_id" not in session: 
        return render_template("login.html", message = "unauthorize access.")
    return render_template("admin_dashboard.html", companies = companies, students = students , user = user, drives = drives, applications = applications)

@app.route("/admin_drive_details/<int:id>", methods = ["GET", "POST"]) 
def admin_drive_details(id): 
    drive = PlacementDrive.query.get(id)
    company = Company.query.filter_by(id = drive.company_id)
    return render_template("admin_drive_details.html", drive = drive, company = company) 

@app.route("/admin_comp_details/<int:id>", methods = ["GET", "POST"]) 
def comp_details(id): 
    company = Company.query.get(id)
    user = User.query.get(company.user_id)
    return render_template("admin_com_details.html", company = company, user = user)

@app.route("/admin_stu_details/<int:id>", methods = ["GET", "POST"])
def stu_details(id): 
    student = Student.query.get(id) 
    user = User.query.get(student.user_id)
    return render_template("admin_stu_details.html", student = student, user = user)

@app.route("/admin_stu_balcklist/<int:id>", methods = ["GET", "POST"]) 
def blacklist(id):
    student = Student.query.get(id)
    user = User.query.get(student.user_id) 
    user.is_blocked = True
    db.session.commit() 
    return redirect(url_for("admin_dash"))

@app.route("/comp_blacklist/<int:id>", methods = ["GET", "POST"]) 
def comp_blacklist(id): 
    company = Company.query.get(id) 
    user = User.query.get(company.user_id) 
    user.is_blocked = True
    db.session.commit()
    return redirect(url_for("admin_dash"))

@app.route("/comp_approval/<int:id>", methods = ["GET", "POST"]) 
def comp_approval(id): 
    company = Company.query.get(id)
    company.is_verified = True 
    db.session.commit() 
    return redirect(url_for("admin_dash"))

@app.route("/comp_rejection/<int:id>", methods = ["GET", "POST"]) 
def comp_rejection(id): 
    company = Company.query.get(id) 
    company.is_verified = False
    db.session.commit() 
    return redirect(url_for("admin_dash"))


@app.route("/admin_stu_application/<int:id>", methods = ["GET" , "POST"]) 
def admin_stu_application(id): 
    application = Application.query.get(id) 
    drive = PlacementDrive.query.get(application.drive_id) 
    student = Student.query.get(application.student_id) 
    user = User.query.get(application.student.user_id)
    return render_template("admin_stu_appli.html", application = application, drive = drive, student = student,user = user)

@app.route("/logout") 
def logout(): 
    session.clear() 
    return redirect(url_for('login')) 

if __name__ == "__main__": 
    with app.app_context(): 
        db.create_all()
        admin = User.query.filter_by(username = "admin").first() 
        if admin is None: 
            admin = User(username = "admin", password= "admin@123" , email = "admin@ppa.email.com", role = "admin")
            db.session.add(admin) 
            db.session.commit()
    app.run(debug=True)