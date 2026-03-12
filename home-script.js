// MysteryTrace Homepage - Dynamic loader from posts.json
// To add a new post: just add an entry to posts.json — homepage updates automatically!

// ===== MONETAG IN-PAGE PUSH — AUTO INJECT =====
(function(s){
  s.dataset.zone = '10717779';
  s.src = 'https://nap5k.com/tag.min.js';
})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));

// ===== MONETAG VIGNETTE BANNER — AUTO INJECT =====
(function(s){
  s.dataset.zone = '10706013';
  s.src = 'https://gizokraijaw.net/vignette.min.js';
})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));

const POSTS_PER_PAGE = 9; // How many posts show before "Load More"
let allPosts = [];
let currentFilter = 'all';
let visibleCount = POSTS_PER_PAGE;

// ===== LOAD POSTS FROM JSON =====
fetch('posts.json')
  .then(res => res.json())
  .then(data => {
    // Sort by date — newest first (latest post always appears first)
    allPosts = data.posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Update total count in YouTube section
    document.getElementById('totalPosts').textContent = allPosts.length;

    // Update YouTube latest info with newest post title
    const latest = allPosts[0];
    if (latest) {
      document.getElementById('ytLatestInfo').innerHTML = `
        <h4>Latest: ${latest.title}</h4>
        <p>Watch Now on MysteryTrace YouTube</p>
      `;
    }

    buildFeatured();
    buildCategories(data.categories);
    buildPosts();
    buildFooterCategories(data.categories);
  })
  .catch(err => console.error('Could not load posts.json:', err));

// ===== BUILD FEATURED SECTION =====
// Shows newest post as main feature + next 3 as side cards
function buildFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid || allPosts.length === 0) return;

  const main = allPosts[0];
  const sides = allPosts.slice(1, 4);

  grid.innerHTML = `
    <div class="card" data-post-url="articles/${main.slug}.html">
      <img src="article-picks/${main.slug}.jpg" alt="${main.title}" class="card-img" onerror="this.style.display='none'">
      <div class="card-badge">Latest</div>
      <div class="card-body">
        <p class="card-cat">${main.categoryDisplay}</p>
        <h3>${main.title}</h3>
        <p>${main.excerpt}</p>
        <div class="card-meta">
          <span>📅 ${formatDate(main.date)}</span>
          <span>⏱ ${main.readTime} read</span>
        </div>
      </div>
    </div>
    <div class="side-cards">
      ${sides.map(p => `
        <div class="card" data-post-url="articles/${p.slug}.html">
          <img src="article-picks/${p.slug}.jpg" alt="${p.title}" class="card-img side-img" onerror="this.style.display='none'">
          <div class="card-body">
            <p class="card-cat">${p.categoryDisplay}</p>
            <h3>${p.title}</h3>
            <div class="card-meta"><span>⏱ ${p.readTime}</span></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  attachCardClicks(grid);
}

// ===== BUILD CATEGORIES =====
function buildCategories(categories) {
  const grid = document.getElementById('categoriesGrid');
  if (!grid) return;

  // Count actual posts per category from loaded posts
  const counts = { all: allPosts.length };
  allPosts.forEach(p => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });

  const catOrder = ['all', 'space', 'disappearance', 'maritime', 'crime', 'unexplained', 'disaster'];

  grid.innerHTML = catOrder.map(key => {
    const cat = categories[key];
    if (!cat) return '';
    return `
      <div class="cat-card" data-category="${key}">
        <span class="cat-icon">${cat.icon}</span>
        <span class="cat-name">${cat.name}</span>
        <span class="cat-count">${counts[key] || 0} stories</span>
      </div>
    `;
  }).join('');

  // Attach filter events
  grid.querySelectorAll('.cat-card').forEach(card => {
    card.addEventListener('click', function() {
      grid.querySelectorAll('.cat-card').forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.getAttribute('data-category');
      visibleCount = POSTS_PER_PAGE;
      buildPosts();
      document.getElementById('latest').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ===== BUILD POSTS GRID =====
function buildPosts() {
  const grid = document.getElementById('postsGrid');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (!grid) return;

  // Filter posts
  const filtered = currentFilter === 'all'
    ? allPosts
    : allPosts.filter(p => p.category === currentFilter);

  // Show only visibleCount posts
  const visible = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visibleCount;

  grid.innerHTML = visible.map(p => `
    <div class="card post-card" data-post-url="articles/${p.slug}.html" data-category="${p.category}">
      <img src="article-picks/${p.slug}.jpg" alt="${p.title}" class="card-img" onerror="this.style.display='none'">
      <div class="card-body">
        <p class="card-cat">${p.categoryDisplay}</p>
        <h3>${p.title}</h3>
        <p>${p.excerpt}</p>
        <div class="card-meta">
          <span>📅 ${formatDate(p.date)}</span>
          <span>⏱ ${p.readTime}</span>
        </div>
      </div>
    </div>
  `).join('');

  attachCardClicks(grid);

  // Load More button
  if (remaining > 0) {
    loadMoreBtn.style.display = 'inline-block';
    loadMoreBtn.textContent = `Load More Stories (${remaining} more)`;
    loadMoreBtn.onclick = function() {
      visibleCount += POSTS_PER_PAGE;
      buildPosts();
      // Scroll to first new card
      const cards = grid.querySelectorAll('.post-card');
      if (cards[visibleCount - POSTS_PER_PAGE]) {
        cards[visibleCount - POSTS_PER_PAGE].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
  } else {
    loadMoreBtn.style.display = 'none';
  }
}

// ===== BUILD FOOTER CATEGORY LINKS =====
function buildFooterCategories(categories) {
  const list = document.getElementById('footerCatLinks');
  if (!list) return;

  const catOrder = ['space', 'disappearance', 'maritime', 'crime', 'unexplained'];
  list.innerHTML = catOrder.map(key => {
    const cat = categories[key];
    if (!cat) return '';
    return `<li><a href="#" data-filter="${key}">${cat.name}</a></li>`;
  }).join('');

  list.querySelectorAll('a[data-filter]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const catCard = document.querySelector(`.cat-card[data-category="${this.getAttribute('data-filter')}"]`);
      if (catCard) catCard.click();
    });
  });
}

// ===== CARD CLICK HANDLER =====
function attachCardClicks(container) {
  container.querySelectorAll('.card[data-post-url]').forEach(card => {
    card.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = this.getAttribute('data-post-url');
    });
  });
}

// ===== FORMAT DATE =====
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// ===== PARTICLES =====
const container = document.getElementById('particles');
if (container) {
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.animationDuration = (8 + Math.random() * 15) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.width = p.style.height = (1 + Math.random() * 3) + 'px';
    if (Math.random() > 0.5) p.style.background = '#c0392b';
    container.appendChild(p);
  }
}

// ===== SCROLL TOP =====
window.addEventListener('scroll', () => {
  const btn = document.getElementById('scrollTop');
  if (btn) btn.classList.toggle('visible', window.scrollY > 400);
});
