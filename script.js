document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'http://localhost:4000/tasks';

  fetchAndRenderTasks();

 
  async function fetchAndRenderTasks() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const tasks = await response.json();
      renderKanbanBoard(tasks);
    } catch (error) {
      console.error('Error fetching tasks from backend:', error);
    }
  }

  
  function renderKanbanBoard(tasks) {
    const columns = {
      todo: document.querySelector('.kanban-column[data-status="todo"]'),
      in_progress: document.querySelector('.kanban-column[data-status="in_progress"]'),
      done: document.querySelector('.kanban-column[data-status="done"]')
    };

    Object.values(columns).forEach(column => {
      if (!column) return;
      const cards = column.querySelectorAll('.kanban-card');
      cards.forEach(card => card.remove());
    });

    const counts = { todo: 0, in_progress: 0, done: 0 };

    tasks.forEach(task => {
      const statusKey = normalizeStatus(task.status);
      const targetColumn = columns[statusKey];

      if (targetColumn) {
        counts[statusKey]++;
        const cardHTML = createKanbanCardHTML(task);
        targetColumn.insertAdjacentHTML('beforeend', cardHTML);
      }
    });

    Object.keys(counts).forEach(status => {
      if (columns[status]) {
        const countBadge = columns[status].querySelector('.column-header small');
        if (countBadge) countBadge.textContent = counts[status];
      }
    });
  }

  
  function normalizeStatus(status = '') {
    const s = status.toLowerCase().trim();
    if (s === 'in_progress' || s === 'in progress' || s === 'doing') return 'in_progress';
    if (s === 'done' || s === 'completed') return 'done';
    return 'todo';
  }

 
  function createKanbanCardHTML(task) {
    const isDone = normalizeStatus(task.status) === 'done';

    let sidebarStyle = '';
    let pillStyle = 'background:#e0e7ff; color:#4338ca;';
    let pillText = task.priority || '⚡ Active';
    let timeHeader = 'START & END';
    let timeValue = task.startTime && task.endTime ? `${task.startTime} - ${task.endTime}` : 'Flexible';

    if (isDone) {
      sidebarStyle = 'background:#ecfdf5; border-color:#a7f3d0;';
      pillStyle = 'background:#d1fae5; color:#059669;';
      pillText = task.priority || '✓ Done';
      timeHeader = 'COMPLETED';
      timeValue = task.completedDate || 'Recently';
    } else if (String(task.priority).toLowerCase().includes('high')) {
      pillStyle = 'background:#fee2e2; color:#dc2626;';
    }

    return `
      <div class="kanban-card" data-task-id="${escapeHTML(task.id)}">
        <div class="card-sidebar-status" style="${sidebarStyle}">
          <span class="status-pill" style="${pillStyle}">${escapeHTML(pillText)}</span>
          <div>
            <strong>${timeHeader}</strong><br>
            ${escapeHTML(timeValue)}
          </div>
        </div>
        <div class="card-body">
          <div class="task-title-row">
            <span class="task-title">${escapeHTML(task.title || 'Untitled Task')}</span>
            <span class="task-id">#${escapeHTML(task.id)}</span>
          </div>
          <div class="task-details">
            <span>Repository: <strong>${escapeHTML(task.repository || 'matrix-core')}</strong></span>
            <span>Assignee: ${escapeHTML(task.assignee || 'Unassigned')}</span>
          </div>
          <div class="task-meta-footer">
            <span>Steps: ${Number(task.completedSteps) || 0}/${Number(task.totalSteps) || 0} Done</span>
            <span>${escapeHTML(task.actionText || (isDone ? 'Closed' : 'Clock In'))}</span>
          </div>
        </div>
      </div>
    `;
  }


  function escapeHTML(str) {
    return String(str ?? '').replace(/[&<>"']/g, match => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[match]));
  }
});