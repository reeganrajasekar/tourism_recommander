from flask import Flask, render_template , request , redirect, session
import sqlite3
app = Flask(__name__, static_url_path='/static')
app.secret_key = "crth5yjt7ynp98un"

@app.route("/")  
def index():
    return render_template("index.html")

@app.route("/login")  
def login():
    return render_template("login.html")

@app.route("/signin", methods =["GET", "POST"])  
def user_login():
    if request.method == "POST":
        con = sqlite3.connect("database.db")  
        con.row_factory = sqlite3.Row  
        cur = con.cursor()  
        cur.execute("select * from user WHERE email=? AND password=?",(request.form["email"],request.form["password"]))  
        rows = cur.fetchall()
        if len(rows)>0:
            for row in rows:
                session["id"]=row["id"]
                session["name"]=row["name"]
            return redirect("/user")
        else:
            return redirect("/login?err=email or password is wrong!")
    return redirect("/")

@app.route("/register")  
def register():
    return render_template("register.html")

@app.route("/signup", methods =["GET", "POST"])  
def user_register():
    if request.method == "POST":
        con = sqlite3.connect("database.db")
        con.execute("INSERT into user(name , email, password) values (?,?,?)",(request.form["name"],request.form["email"],request.form["password"]))
        con.commit()
        return redirect("/login?msg=Signup Successfully!")
    return redirect("/")

@app.route("/user")  
def user():
    name=session["name"]
    return render_template("home.html",name=name)

@app.route("/table")
def table():
    con = sqlite3.connect("database.db")
    con.execute("CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,email TEXT NOT NULL,password TEXT NOT NULL)")
    return "Table Created"

if __name__ == '__main__':
   app.run()