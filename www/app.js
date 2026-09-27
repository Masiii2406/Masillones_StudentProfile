var DEFAULT_PROFILE = {
    fullName: "Vince Masillones",
    course: "BS Information Technology",
    yearLevel: "3rd Year",
    about: "Hello! My name is Vince Martin R. Masillones. I am a 3rd Year BSIT College Student interested in learning new things. I enjoy working on projects that allow me to improve my creativity, technical skills, and problem solving abilities.",
    skills: ["HTML5", "CSS3", "JavaScript", "Java Programming", "Networking"]
};

// ---- Load profile ----
function loadProfile() {
    var saved = localStorage.getItem("studentProfile");
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            return DEFAULT_PROFILE;
        }
    }
    return DEFAULT_PROFILE;
}

function saveProfileToStorage(profile) {
    localStorage.setItem("studentProfile", JSON.stringify(profile));
}

function displayProfile(profile) {
    document.getElementById("display-name").textContent = profile.fullName;
    document.getElementById("display-course").textContent = profile.course;
    document.getElementById("display-year").textContent = profile.yearLevel;
    document.getElementById("display-about").textContent = profile.about;

    var skillsList = document.getElementById("display-skills");
    skillsList.innerHTML = "";
    for (var i = 0; i < profile.skills.length; i++) {
        var li = document.createElement("li");
        li.textContent = profile.skills[i];
        skillsList.appendChild(li);
    }
}

function loadProfilePicture() {
    var saved = localStorage.getItem("profilePicture");
    if (saved) {
        document.getElementById("profile-pic").src = saved;
        var hoverImg = document.getElementById("profile-pic-hover");
        if (hoverImg) {
            hoverImg.style.display = "none";
        }
    }
}

function saveProfilePicture(uri) {
    localStorage.setItem("profilePicture", uri);
}

function showCameraMessage(text, isError) {
    var box = document.getElementById("camera-message");
    box.textContent = text;
    box.className = "camera-message";
    if (isError) {
        box.className += " camera-error";
    } else {
        box.className += " camera-info";
    }
    setTimeout(function() {
        box.textContent = "";
        box.className = "camera-message";
    }, 4000);
}

function openCamera() {
    if (!navigator.camera) {
        showCameraMessage(
            "Camera is only available on a device. Please run the app in Cordova.",
            true
        );
        return;
    }

    var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL, // changed from FILE_URI
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        correctOrientation: true,
        targetWidth: 400,
        targetHeight: 400,
        saveToPhotoAlbum: false
    };

    navigator.camera.getPicture(
        function(imageData) {
            var dataUri = "data:image/jpeg;base64," + imageData;
            document.getElementById("profile-pic").src = dataUri;
            var hoverImg = document.getElementById("profile-pic-hover");
            if (hoverImg) {
                hoverImg.style.display = "none";
            }
            saveProfilePicture(dataUri);
            showCameraMessage("Profile picture updated!", false);
        },
        function(errorMessage) {
            var msg = (errorMessage || "").toLowerCase();
            if (msg.indexOf("cancel") !== -1) {
                return;
            }
            showCameraMessage(
                "Unable to access the camera. Please check your device permissions.",
                true
            );
        },
        options
    );
}

function showEditForm(profile) {
    document.getElementById("profile-view").style.display = "none";
    document.getElementById("edit-view").style.display = "block";

    document.getElementById("input-name").value = profile.fullName;
    document.getElementById("input-course").value = profile.course;
    document.getElementById("input-year").value = profile.yearLevel;
    document.getElementById("input-about").value = profile.about;
    document.getElementById("input-skills").value = profile.skills.join("\n");

    document.getElementById("form-errors").textContent = "";
}

function showProfileView() {
    document.getElementById("edit-view").style.display = "none";
    document.getElementById("profile-view").style.display = "block";
}

function validateForm() {
    var name = document.getElementById("input-name").value.trim();
    var course = document.getElementById("input-course").value.trim();
    var year = document.getElementById("input-year").value.trim();
    var about = document.getElementById("input-about").value.trim();
    var skills = document.getElementById("input-skills").value.trim();

    if (name === "") return "Please enter your full name.";
    if (course === "") return "Please enter your course.";
    if (year === "") return "Please enter your year level.";
    if (about === "") return "Please enter your About Me.";
    if (skills === "") return "Please enter at least one skill.";
    return "";
}

function handleSave() {
    var error = validateForm();
    if (error !== "") {
        document.getElementById("form-errors").textContent = error;
        return;
    }

    var skillLines = document.getElementById("input-skills").value.split("\n");
    var skillArray = [];
    for (var i = 0; i < skillLines.length; i++) {
        var s = skillLines[i].trim();
        if (s !== "") skillArray.push(s);
    }

    var updatedProfile = {
        fullName: document.getElementById("input-name").value.trim(),
        course: document.getElementById("input-course").value.trim(),
        yearLevel: document.getElementById("input-year").value.trim(),
        about: document.getElementById("input-about").value.trim(),
        skills: skillArray
    };

    saveProfileToStorage(updatedProfile);
    displayProfile(updatedProfile);
    showProfileView();
}

function handleCancel() {
    showProfileView();
}

function initializeApp() {
    var currentProfile = loadProfile();
    displayProfile(currentProfile);
    loadProfilePicture();

    document.getElementById("edit-btn").addEventListener("click", function() {
        currentProfile = loadProfile();
        showEditForm(currentProfile);
    });

    document.getElementById("edit-form").addEventListener("submit", function(event) {
        event.preventDefault();
        handleSave();
    });

    document.getElementById("cancel-btn").addEventListener("click", handleCancel);
    document.getElementById("change-pic-btn").addEventListener("click", openCamera);
    document.getElementById("avatar-btn").addEventListener("click", openCamera);
}

document.addEventListener("deviceready", initializeApp, false);

if (!window.cordova) {
    document.addEventListener("DOMContentLoaded", initializeApp, false);
}