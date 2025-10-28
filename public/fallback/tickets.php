<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Ticket App - Tickets</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <section class="layout">
    <nav class="topnav">
      <div class="brand">Ticket App</div>
      <div class="nav-actions">
        <a href="/dashboard.php" class="btn small">Dashboard</a>
        <button id="logoutBtn" class="btn small btn-ghost">Logout</button>
      </div>
    </nav>
    <main class="container">
      <h2>Tickets</h2>
      <div class="controls">
        <button id="createTicketBtn" class="btn">Create Ticket</button>
        <div id="ticketsToast" class="toast"></div>
      </div>
      <div id="ticketsList" class="tickets-grid">
        <!-- tickets rendered here -->
      </div>

      <!-- Ticket Modal -->
      <div id="ticketModal" class="modal" aria-hidden="true">
        <div class="modal-content" role="dialog" aria-modal="true">
          <h3 id="modalTitle">Create Ticket</h3>
          <form id="ticketForm">
            <label for="title">Title</label>
            <input id="title" name="title" required />
            <span class="error" id="titleError"></span>

            <label for="status">Status</label>
            <select id="status" name="status" required>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
            <span class="error" id="statusError"></span>

            <label for="description">Description</label>
            <textarea id="description" name="description"></textarea>

            <div class="modal-actions">
              <button type="button" id="cancelBtn" class="btn btn-ghost">Cancel</button>
              <button type="submit" class="btn">Save</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Confirm Modal -->
      <div id="confirmModal" class="modal" aria-hidden="true">
        <div class="modal-content">
          <h3>Confirm</h3>
          <p id="confirmMessage">Are you sure?</p>
          <div class="modal-actions">
            <button id="confirmCancel" class="btn btn-ghost">Cancel</button>
            <button id="confirmOk" class="btn danger">Delete</button>
          </div>
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
