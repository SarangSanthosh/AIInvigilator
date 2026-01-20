# AIInvigilator

Real-time malpractice detection system for classroom examinations using computer vision and deep learning.

---

## Installation & Setup

### Prerequisites
- **Operating System:** Windows 10/11, or Ubuntu 20.04+
- **Hardware:** 
  - Webcam (1080p recommended)
  - CPU with at least 4 cores
- **Software:**
  - Python 3.10+ 
  - MySQL or MariaDB
  - Git

### Installation Steps

1. **Clone Repository**
```bash
git clone https://github.com/SarangSanthosh/AIInvigilator.git
cd AIInvigilator
```

2. **Create Virtual Environment** (optional but recommended)
```bash
python -m venv venv
source venv/bin/activate      # Linux or Mac
.\venv\Scripts\activate       # Windows
```

3. **Install Dependencies**
```bash
pip install -r requirements.txt
```

4. **Database Configuration**
- Install and configure MySQL on your system
- Update database credentials in `app/settings.py`
- Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. **Create Superuser** (optional)
```bash
python manage.py createsuperuser
```

---

## How to Run

### 1. Start Django Server
```bash
python manage.py runserver
```
- Access the web interface at `http://127.0.0.1:8000/`

### 2. Run Camera Detection Scripts
- Edit `ML/front.py` to configure:
  - Camera index
  - Lecture hall information
  - Database credentials

- Launch the detection script:
```bash
python ML/front.py
```

### 3. Access Dashboard
- Navigate to `http://localhost:8000/login`
- Login with your credentials
- Review detected malpractice logs in the dashboard

---

## Features

- Real-time detection of 5 malpractice types:
  - Mobile phone usage
  - Turning back
  - Leaning
  - Hand raising
  - Paper passing
- Video evidence recording
- Admin dashboard for log review
- Email/SMS notifications
- Multi-camera support

---

## ML Models

- `yolov8n-pose.pt` — Pose Estimation
- `yolo11n.pt` — Object Detection

---

## License

This project is for educational purposes.



