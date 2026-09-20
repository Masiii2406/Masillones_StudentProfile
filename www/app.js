var DEFAULT_PROFILE = {
    fullName: "Vince Masillones",
    course: "BS Information Technology",
    yearLevel: "3rd Year",
    about: "Hello! My name is Vince Martin R. Masillones. I am a 3rd Year BSIT College Student interested in learning new things. I enjoy working on projects that allow me to improve my creativity, technical skills, and problem solving abilities.",
    skills: ["HTML5", "CSS3", "JavaScript", "Java Programming", "Networking"]
};

function loadProfile() {
    var saved = localStorage.getItem("studentProfile");
    if (saved) {
        return JSON.parse(saved);
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

    // Build the skills list
    var skillsList = document.getElementById("display-skills");
    skillsList.innerHTML = "";
    for (var i = 0; i < profile.skills.length; i++) {
        var li = document.createElement("li");
        li.textContent = profile.skills[i];
        skillsList.appendChild(li);
    }
}

function showEditForm(profile) {
    document.getElementById("profile-view").style.display = "none";
    document.getElementById("edit-view").style.display = "block";

    // Fill the form with current data
    document.getElementById("input-name").value = profile.fullName;
    document.getElementById("input-course").value = profile.course;
    document.getElementById("input-year").value = profile.yearLevel;
    document.getElementById("input-about").value = profile.about;
    document.getElementById("input-skills").value = profile.skills.join("\n");

    // Clear any previous errors
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

    if (name === "") {
        return "Please enter your full name.";
    }
    if (course === "") {
        return "Please enter your course.";
    }
    if (year === "") {
        return "Please enter your year level.";
    }
    if (about === "") {
        return "Please enter your About Me.";
    }
    if (skills === "") {
        return "Please enter at least one skill.";
    }
    return "";
}

function handleSave() {
    // 1. Validate
    var error = validateForm();
    if (error !== "") {
        document.getElementById("form-errors").textContent = error;
        return;
    }

    // 2. Build the updated profile object
    var skillLines = document.getElementById("input-skills").value.split("\n");
    var skillArray = [];
    for (var i = 0; i < skillLines.length; i++) {
        var s = skillLines[i].trim();
        if (s !== "") {
            skillArray.push(s);
        }
    }

    var updatedProfile = {
        fullName: document.getElementById("input-name").value.trim(),
        course: document.getElementById("input-course").value.trim(),
        yearLevel: document.getElementById("input-year").value.trim(),
        about: document.getElementById("input-about").value.trim(),
        skills: skillArray
    };

    // 3. Save to localStorage
    saveProfileToStorage(updatedProfile);

    // 4. Update the display
    displayProfile(updatedProfile);

    // 5. Return to profile view
    showProfileView();
}

function handleCancel() {
    // Just hide the form - no data is saved
    showProfileView();
}
	
document.addEventListener("DOMContentLoaded", function() {
    // 1. Load and display the profile
    var currentProfile = loadProfile();
    displayProfile(currentProfile);

    // 2. Edit button
    document.getElementById("edit-btn").addEventListener("click", function() {
        // Reload from storage so the form always shows the latest saved data
        currentProfile = loadProfile();
        showEditForm(currentProfile);
    });

    // 3. Save (form submit)
    document.getElementById("edit-form").addEventListener("submit", function(event) {
        event.preventDefault();  // prevent page reload
        handleSave();
    });

    // 4. Cancel button
    document.getElementById("cancel-btn").addEventListener("click", handleCancel);
});