<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Ticket App - Dashboard</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <section class="layout">
    <nav class="topnav">
      <div class="brand">Ticket App</div>
      <div class="nav-actions">
        <a href="/tickets.php" class="btn small">Tickets</a>
        <button id="logoutBtn" class="btn small btn-ghost">Logout</button>
      </div>
    </nav>
    <main class="container">
      <h2>Dashboard</h2>
      <div class="stats-grid">
        <div class="card stat-card">
          <h3>Total Tickets</h3>
          <p id="totalCount">0</p>
        </div>
        <div class="card stat-card">
          <h3>Open</h3>
          <p id="openCount">0</p>
        </div>
        <div class="card stat-card">
          <h3>Closed</h3>
          <p id="closedCount">0</p>
        </div>
      </div>
    </main>
  </section>

  <footer class="footer">Ticket App &copy; 2025</footer>
  <div id="ariaLive" class="sr-only" aria-live="polite" aria-atomic="true"></div>
  <script>window.pageProtected = true;</script>
  <script src="/js/app.js"></script>
  <script src="/js/auth.js"></script>
  <script src="/js/tickets.js"></script>
</body>
</html>
