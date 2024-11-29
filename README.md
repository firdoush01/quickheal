# 🚀 *QuickHeal Web App*  
🌟 Revolutionizing Healthcare with Seamless Video Consultations, Query Management, and Prescriptions  

---

## 📖 *Overview*  
QuickHeal is a comprehensive healthcare web app designed to connect patients and doctors effortlessly.  
- Patients can consult with doctors via *video calls*, manage their **queries**, and receive **prescriptions**.  
- Doctors can manage *availability*, respond to queries, and provide prescriptions efficiently.  
- The app also features an *admin panel* for management, accessible via specific routes.  

---

## ✨ *Key Features*  

### *For Patients*  
- 🎥 *Video Consultations*: Initiate video calls with available doctors using **Socket.io** for real-time communication.  

### *For Doctors*  
- 🟢 *Availability Status*: Toggle status (Available/Unavailable) to indicate readiness for consultations.  
- ❓ *Query Management*: View and respond to patient queries.  

### *Admin Panel* (Accessible via routes)  
- /admin: Main admin dashboard.  
- /admin/auth: Authentication page for admin login.  
(Not part of visible website navigation but accessible via direct URL routes.)  

---

## 🛠️ *Tech Stack*  

- *Frontend*: ⚛️ React, 🌊 Tailwind CSS  
- *Backend*: 🟢 Node.js, ⚡ Express.js  
- *Database*: 🍃 MongoDB  
- *Real-Time Communication*: 📡 Socket.io  
- *Video Call Integration*: 📹 WebRTC/Third-Party API  
- *Authentication*: 🔐 Bcrypt Password Hashing for Patients, Doctors, and Admin.  
- *Hosting*: Vercel, Render

---

## 🌐 *Live Demo*  
🔗 Visit QuickHeal: [QuickHeal Web App](https://quickheal.vercel.app/)  

---

## 🖥️ *Screenshots*  
### *Patient Dashboard*  
![Patient Dashboard](https://github.com/user-attachments/assets/171ec425-980e-44bc-a4fc-d37dab488663)  

### *Doctor Panel*  
![Doctor Panel](https://github.com/user-attachments/assets/683411e1-5c8d-4c4e-ae12-3de6b244c9d2)  

### *Video Consultation*  
![Video Consultation](https://github.com/user-attachments/assets/25f55d01-60d9-43ae-a68d-cd1a4e82019a)  


---

## 🚀 *Getting Started*  

### *Prerequisites*  
- Node.js  
- MongoDB  

# Clone the repository
git clone https://github.com/joefelx/quickheal.git

# Navigate to the project directory
cd quickheal

# Install dependencies for backend and frontend
cd client && npm install && cd ../server && npm install


### *Running the Application*  

bash
# Start the backend server
cd server && npm run dev

# Start the frontend
cd client && npm start
  

---

## 🛡️ *Security*  

QuickHeal ensures data privacy and security with:  
- 🔐 *Secure Password Storage* for all users (Patients, Doctors, and Admin).  
- 🔒 *Secure communication* via HTTPS (if hosted on a secure domain).  

---

## 🛠️ *Future Enhancements*  

- 📱 *Mobile app* for better accessibility.  
- 🗂️ *Comprehensive patient medical history* management.  
- 🤖 *AI-powered symptom checker* for preliminary diagnosis.  
- 🔄 *Integration with pharmacy services* for medication delivery.  

---

## 👨‍💻 *Contributors*  

- *Karim Suhail S*  
- *Joe Felix A*  
- *Mohammed Haris Hasan A*  

---

## 📝 *License*  

This project is licensed under the [MIT License](LICENSE).  

---

## 🙏 *Thank You*  

We appreciate your interest in QuickHeal.  
If you have suggestions, feedback, or want to contribute, feel free to reach out.  
Together, let’s revolutionize healthcare! 😊  
