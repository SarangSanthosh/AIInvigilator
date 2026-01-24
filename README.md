# AIInvigilator 🎓

Real-time AI-powered examination monitoring system using computer vision to detect malpractice in exam halls.

## 🏗️ Architecture

- **Frontend**: React 18 with Vite, Tailwind CSS v4, and React Router
- **Backend**: Django 3.2.7 with Django REST Framework
- **Authentication**: JWT tokens with automatic refresh
- **Database**: MySQL
- **ML/AI**: YOLOv8/v11 for object detection and pose estimation

---

## 📋 Prerequisites

### Required Software
- **Python**: 3.8 or higher
- **Node.js**: 20.0 or higher
- **MySQL**: 8.0 or higher
- **Git**: Latest version

### Hardware Requirements
- Webcam (1080p recommended for best detection)
- CPU with at least 4 cores
- 8GB RAM minimum

---

## 🚀 Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/SarangSanthosh/AIInvigilator.git
cd AIInvigilator
```

### 2. Backend Setup (Django)

#### Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate      # Linux/Mac
.\venv\Scripts\activate       # Windows
```

#### Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### Database Configuration
- Install and start MySQL on your system
- Update database credentials in `app/settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'aiinvigilator',
        'USER': 'your_username',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

#### Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

#### Create Superuser
```bash
python manage.py createsuperuser
```

### 3. Frontend Setup (React)

#### Navigate to Frontend Directory
```bash
cd frontend
```

#### Install Node Dependencies
```bash
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `frontend/` directory:
```bash
VITE_API_URL=http://localhost:8000/api
```

---

## ▶️ Running the Application

### Option 1: Using Helper Scripts (Recommended)

```bash
# Make scripts executable (first time only)
chmod +x start_servers.sh stop_servers.sh check_status.sh

# Start both Django and React servers
./start_servers.sh

# Check if servers are running
./check_status.sh

# Stop all servers
./stop_servers.sh
```

### Option 2: Manual Start

**Terminal 1 - Start Django Backend:**
```bash
# From project root
python manage.py runserver
```
- Backend API runs at: `http://localhost:8000`
- Admin panel at: `http://localhost:8000/admin`

**Terminal 2 - Start React Frontend:**
```bash
# From frontend directory
cd frontend
npm run dev
```
- Frontend UI runs at: `http://localhost:5173`

### 3. Run Camera Detection Scripts

**Edit ML Configuration** (`ML/front.py`):
- Configure camera index
- Set lecture hall information
- Update database credentials

**Launch Detection:**
```bash
python ML/front.py
```

---

## 🌐 Accessing the Application

1. **Open Browser**: Navigate to `http://localhost:5173`
2. **Register**: Click "Get Alerted" → Sign Up
   - Fill in teacher registration form
   - Upload profile picture (optional)
3. **Login**: Use your credentials to access dashboard
4. **Dashboard**: View real-time malpractice detections
5. **Demo Videos**: Click video cards to see detection examples

---


## 🔧 Technology Stack

### Backend
- **Django 3.2.7**: Web framework
- **Django REST Framework 3.14.0**: RESTful API
- **SimpleJWT 5.3.0**: JWT authentication
- **django-cors-headers 4.3.0**: CORS support
- **MySQL Connector**: Database driver
- **Twilio**: SMS notifications

### Frontend
- **React 18.3.1**: UI library
- **Vite 7.3.1**: Build tool & dev server
- **Tailwind CSS v4**: Utility-first CSS
- **React Router 7.1.3**: Client-side routing
- **Zustand 5.0.3**: State management
- **Axios 1.7.9**: HTTP client

### Machine Learning
- **Ultralytics YOLO**: Detection models
- **PyTorch 2.6.0**: Deep learning framework
- **OpenCV 4.10**: Computer vision
- **Models Used**:
  - `yolov8n.pt` - Object detection
  - `yolov8n-pose.pt` - Pose estimation
  - `yolo11n.pt` - Enhanced detection
  - `yolo11m.pt` - Medium model

---

## 🎨 Frontend Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Key Features
- **Hot Module Replacement**: Changes appear instantly
- **Dark Mode**: Persisted in localStorage
- **Protected Routes**: Auto-redirect if not authenticated
- **Form Validation**: Real-time error feedback
- **Toast Notifications**: User-friendly alerts

---
## 🐛 Troubleshooting

### Frontend won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Backend database errors
```bash
# Reset migrations
python manage.py migrate --fake
python manage.py migrate
```

### CORS errors
- Check `CORS_ALLOWED_ORIGINS` in `app/settings.py`
- Ensure it includes `http://localhost:5173`

### Video playback issues
- Mobile detection video may need re-encoding:
```bash
ffmpeg -i mobile.mp4 -movflags faststart mobile_fixed.mp4
```

---

## 📝 License

This project is for educational and research purposes.

---

## 👥 Contributors

- Sarang Santhosh - [@SarangSanthosh](https://github.com/SarangSanthosh)

---

## 🙏 Acknowledgments

- Ultralytics for YOLO models
- Django and React communities
- All contributors and testers

---

## 📧 Contact

For questions or support, please open an issue on GitHub.



