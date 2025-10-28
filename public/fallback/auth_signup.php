<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Ticket App - Signup</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <main class="auth-form">
    <h2>Sign Up</h2>
    <form id="signupForm">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required autofocus>
      <span class="error" id="emailError"></span>
      <label for="password">Password</label>
      <input type="password" id="password" name="password" required>
      <span class="error" id="passwordError"></span>
      <button type="submit" class="btn">Sign Up</button>
    </form>
    <div id="signupToast" class="toast"></div>
    <p>Already have an account? <a href="/auth/login.php">Login</a></p>
  </main>
  <div id="ariaLive" class="sr-only" aria-live="polite" aria-atomic="true"></div>
  <script src="/js/app.js"></script>
  <script src="/js/auth.js"></script>
  <script src="/js/tickets.js"></script>
</body>
</html>
