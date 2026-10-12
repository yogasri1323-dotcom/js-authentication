const USERS_KEY = "auth_users";
const SESSION_KEY = "auth_session";

// Reusable function: read users from localStorage.
const getUsers = () => {
  try {
    const users = JSON.parse(
      localStorage.getItem(USERS_KEY) || "[]"
    );

    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
};

// Reusable function: save users.
const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return true;
};

// Reusable function: validate email.
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Reusable function: validate password.
const isValidPassword = (password) =>
  typeof password === "string" && password.length >= 8;

// Reusable function: show a message.
const showMessage = (element, message, isError = false) => {
  if (!element) return false;

  element.textContent = message;
  element.className = isError ? "error" : "success";
  return true;
};

// Register form.
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email")
      .value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirmPassword =
      document.getElementById("confirmPassword").value;
    const message = document.getElementById("registerMessage");

    if (!name || !isValidEmail(email) ||
        !isValidPassword(password)) {
      showMessage(
        message,
        "Enter a name, valid email, and password of at least 8 characters.",
        true
      );
      return;
    }

    if (password !== confirmPassword) {
      showMessage(message, "Passwords do not match.", true);
      return;
    }

    const users = getUsers();

    if (users.some((user) => user.email === email)) {
      showMessage(message, "This email is already registered.", true);
      return;
    }

    // Demo only: do not store real passwords in browser storage.
    // This example uses a hash to avoid storing the password directly.
    const user = { name, email, password };

    try {
      users.push(user);
      saveUsers(users);
      showMessage(message, "Account created! Redirecting to login.");

      registerForm.reset();

      setTimeout(() => {
        window.location.href = "login.html";
      }, 800);
    } catch {
      showMessage(
        message,
        "Unable to save account. Check browser storage settings.",
        true
      );
    }
  });
}

// Login form.
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email")
      .value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const message = document.getElementById("loginMessage");

    if (!isValidEmail(email) || !password) {
      showMessage(message, "Enter a valid email and password.", true);
      return;
    }

    const user = getUsers().find(
      (item) => item.email === email &&
                item.password === password
    );

    if (!user) {
      showMessage(message, "Invalid email or password.", true);
      return;
    }

    try {
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ email: user.email })
      );

      window.location.href = "dashboard.html";
    } catch {
      showMessage(message, "Unable to start session.", true);
    }
  });
}

// Dashboard: display the current user.
const welcomeMessage = document.getElementById("welcomeMessage");

if (welcomeMessage) {
  let session = null;

  try {
    session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
  } catch {
    session = null;
  }

  const user = session
    ? getUsers().find((item) => item.email === session.email)
    : null;

  if (!user) {
    window.location.replace("login.html");
  } else {
    welcomeMessage.textContent = `Welcome, ${user.name}!`;
    document.getElementById("userEmail").textContent = user.email;
  }
}

// Logout.
const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = "login.html";
  });
}
