// Three.js 3D Background Setup
const initThreeJS = () => {
    const container = document.getElementById('canvas-container');

    // Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.002); // Fog for depth

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Geometry: Abstract Tech Particles
    const geometry = new THREE.BufferGeometry();
    const count = 1000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
        // Spread particles in a random volume
        positions[i] = (Math.random() - 0.5) * 50;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Material: White glowing dots
    const material = new THREE.PointsMaterial({
        size: 0.15,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
    });

    // Mesh
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Adding some connecting lines for "Network" feel (Optional, heavy on performance, let's keep it simple particles + rotation first for smoothness)
    // Let's add a wireframe icosahedron for a "Core" object
    const geo2 = new THREE.IcosahedronGeometry(10, 1);
    const mat2 = new THREE.MeshBasicMaterial({
        color: 0x222222,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const wireframe = new THREE.Mesh(geo2, mat2);
    scene.add(wireframe);


    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation Loop
    const animate = () => {
        requestAnimationFrame(animate);

        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        // Smooth rotation
        particles.rotation.y += 0.001;
        particles.rotation.x += 0.0005;

        wireframe.rotation.y -= 0.002;
        wireframe.rotation.z += 0.001;

        // Interactive Parallax
        particles.rotation.y += 0.05 * (targetX - particles.rotation.y);
        particles.rotation.x += 0.05 * (targetY - particles.rotation.x);

        renderer.render(scene, camera);
    };

    animate();
};

document.addEventListener('DOMContentLoaded', () => {
    // Safe ThreeJS Init
    try {
        initThreeJS();
    } catch (err) {
        console.warn('3D Background failed to load:', err);
    }

    // Intersection Observer for Scroll Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section, .hex-wrapper, .pricing-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.8s ease-out';
        observer.observe(el);
    });

    // Add visible class styling dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Mobile Menu Logic
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Animate hamburger icon -> X ? (Optional)
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
});

// Service Modal Data
const servicesData = {
    'web': {
        title: 'Web Design',
        icon: 'fas fa-globe',
        desc: 'Custom, responsive, and aesthetic websites tailored to your brand. We build everything from landing pages to complex portals.',
        features: ['Responsive UI', 'Custom Branding', 'SEO Ready', 'Fast Loading']
    },
    'hosting': {
        title: 'Web Hosting',
        icon: 'fas fa-server',
        desc: 'Reliable, high-speed hosting solutions ensuring your site is always online and performing at its peak.',
        features: ['99.9% Uptime', 'SSD Storage', 'Daily Backups', '24/7 Support']
    },
    'seo': {
        title: 'SEO & Marketing',
        icon: 'fas fa-chart-line',
        desc: 'Boost your visibility and drive traffic with our data-driven SEO and digital marketing strategies.',
        features: ['Keyword Analysis', 'On-Page Optimization', 'Content Strategy', 'Traffic Analytics']
    },
    'app': {
        title: 'App Development',
        icon: 'fas fa-mobile-alt',
        desc: 'Native and cross-platform mobile applications designed for seamless user experiences on iOS and Android.',
        features: ['iOS & Android', 'Modern UI/UX', 'Cloud Integration', 'Maintenance']
    },
    'repair': {
        title: 'IT Repair',
        icon: 'fas fa-tools',
        desc: 'Expert hardware diagnostics and repair for laptops, desktops, and mobile devices.',
        features: ['Hardware Repair', 'Software Fixes', 'Virus Removal', 'Data Recovery']
    },
    'domain': {
        title: 'Domain Registration',
        icon: 'fas fa-link',
        desc: 'Secure your perfect digital identity with our vast selection of TLDs and domain management tools.',
        features: ['.com / .co.ke', 'DNS Management', 'Privacy Protection', 'Auto-Renewal']
    }
};

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Modal Logic
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('service-modal');
    const closeBtn = document.querySelector('.close-modal');
    const serviceCards = document.querySelectorAll('.hex-wrapper');

    // Elements to update
    const mTitle = document.getElementById('modal-title');
    const mIcon = document.getElementById('modal-icon');
    const mDesc = document.getElementById('modal-desc');
    const mFeatures = document.getElementById('modal-features');
    const mBtn = document.getElementById('modal-btn');

    if (modal && mBtn) {
        // Purchase Button - Redirect to Order Page
        mBtn.addEventListener('click', () => {
            const currentService = mTitle.getAttribute('data-active-service');
            if (currentService) {
                window.location.href = `order.html?service=${currentService}`;
            }
        });

        // Open Modal
        serviceCards.forEach(card => {
            card.addEventListener('click', () => {
                const serviceKey = card.getAttribute('data-service');
                const data = servicesData[serviceKey];

                if (data) {
                    mTitle.setAttribute('data-active-service', serviceKey);
                    mTitle.innerText = data.title;
                    mIcon.className = data.icon;
                    mDesc.innerText = data.desc;
                    mFeatures.innerHTML = data.features.map(f => `<span class='feature-tag'>${f}</span>`).join('');

                    modal.classList.add('show');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        // Close Modal Logic
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });

        // Close on outside click
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    }
});

// Separate Form Handler - Runs independently to ensure functionality
document.addEventListener('DOMContentLoaded', () => {
    // Attach Handler to ALL Forms (Index & Order) - NOW GLOBAL
});

// Global Form Handler
window.handleForm = function (form) {
    // Prevent Default is handled in HTML onsubmit="event.preventDefault(); handleForm(this);"

    // Check if EmailJS is loaded
    if (typeof emailjs === 'undefined') {
        alert('SYSTEM ERROR: Secure transmission protocol (EmailJS) failed to load.\nPlease check your internet connection or disable ad-blockers.');
        console.error('EmailJS object not found.');
        return false;
    }

    // Initialize EmailJS (Safe Check)
    try {
        emailjs.init("I6wZRF59tQI_B8luf");
    } catch (e) {
        console.error("EmailJS Init Failed", e);
    }

    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return false; // Safety check

    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> TRANSMITTING...';
    btn.disabled = true;

    // Data Extraction
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Check if item_name exists
    if (!data.item_name && document.getElementById('form-item-name')) {
        data.item_name = document.getElementById('form-item-name').value;
    }
    if (!data.item_name) {
        data.item_name = "General Inquiry";
    }

    const templateParams = {
        name: data.name,
        email: data.email,
        phone: data.phone || 'N/A',
        message: data.message || data.notes,
        item_name: data.item_name,
        invoice_items: data.invoice_items || '', // HTML Table Rows
        total_amount: data.total_amount || ''    // Total Price String
    };

    // Append Detailed Quote Breakdown if available (Legacy/Backup)
    if (data.quote_details) {
        templateParams.message += "\n\n--- QUOTE BREAKDOWN ---\n" + data.quote_details;
    }

    // Send
    emailjs.send('service_hem4aor', 'template_9ddo88r', templateParams)
        .then(() => {
            const itemName = data.item_name || 'General Inquiry';
            window.location.href = `thank-you.html?item=${encodeURIComponent(itemName)}`;
        })
        .catch((error) => {
            alert('SIGNAL LOST: Could not send transmission. Please check your connection.');
            console.error('EmailJS Error:', error);
            btn.innerHTML = originalText;
            btn.disabled = false;
        });

    return false;
};




// XMP Metadata Extraction Logic
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('xmp-file-input');
    const dropZone = document.getElementById('drop-zone');
    const resultsContainer = document.getElementById('xmp-results');
    const loadingIndicator = document.getElementById('xmp-loading');
    const previewImg = document.getElementById('xmp-preview-img');
    const titleEl = document.getElementById('res-title');
    const descEl = document.getElementById('res-desc');
    const rightsEl = document.getElementById('res-rights');

    if (dropZone && fileInput) {
        // Trigger file input on click
        dropZone.addEventListener('click', () => fileInput.click());

        // Handle File Selection
        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                processImage(e.target.files[0]);
            }
        });

        // Drag and Drop Effects
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                processImage(e.dataTransfer.files[0]);
            }
        });
    }

    async function processImage(file) {
        // ... (existing XMP logic remains) ...
        // Reset UI
        resultsContainer.classList.add('hidden');
        loadingIndicator.classList.remove('hidden');
        titleEl.textContent = 'Scanning...';
        descEl.textContent = 'Scanning...';
        rightsEl.textContent = 'Scanning...';

        try {
            // 1. Preview Image
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImg.src = e.target.result;
            };
            reader.readAsDataURL(file);

            // 2. Extract Metadata
            if (window.exifr) {
                const output = await exifr.parse(file, {
                    xmp: true,
                    tiff: false,
                    ifd0: false,
                    gps: false,
                    exif: false
                });

                console.log('Extracted XMP:', output);

                const getVal = (val) => {
                    if (!val) return null;
                    if (typeof val === 'string') return val;
                    if (typeof val === 'object' && val.value) return val.value;
                    if (Array.isArray(val)) return val.join(', ');
                    return JSON.stringify(val);
                };

                titleEl.textContent = getVal(output?.title) || getVal(output?.Title) || getVal(output?.['dc:title']) || 'Not Found';
                descEl.textContent = getVal(output?.description) || getVal(output?.Description) || getVal(output?.['dc:description']) || 'Not Found';
                rightsEl.textContent = getVal(output?.rights) || getVal(output?.Rights) || getVal(output?.['dc:rights']) || getVal(output?.['xmpRights:Marked']) || 'Not Found';

            } else {
                console.error('Exifr library not found');
                titleEl.textContent = 'Error: Library Missing';
            }

        } catch (err) {
            console.error('Extraction Error:', err);
            titleEl.textContent = 'Extraction Failed';
            descEl.textContent = 'Extraction Failed';
        } finally {
            loadingIndicator.classList.add('hidden');
            resultsContainer.classList.remove('hidden');
        }
    }
});

// Cursor Spotlight Effect for Pricing Cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.pricing-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});


/* ---------------------------------------------------- */
/* PRICING CALCULATOR LOGIC                             */
/* ---------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    const quoteForm = document.getElementById('quote-form');
    const totalDisplay = document.getElementById('total-display');

    if (quoteForm && totalDisplay) {
        const calculateTotal = () => {
            const siteType = parseInt(document.getElementById('site-type').value) || 0;

            let hosting = 0;
            const hostingEl = quoteForm.querySelector('input[name="hosting"]:checked');
            if (hostingEl) hosting = parseInt(hostingEl.value) || 0;

            let domain = 0;
            const domainSelect = document.getElementById('domain-select');
            if (domainSelect) domain = parseInt(domainSelect.value) || 0;

            let addons = 0;
            quoteForm.querySelectorAll('input[name="addon"]:checked').forEach(cb => {
                addons += parseInt(cb.value) || 0;
            });

            let maintenance = 0;
            quoteForm.querySelectorAll('input[name="maintenance"]:checked').forEach(cb => {
                maintenance += parseInt(cb.value) || 0;
            });

            const total = siteType + hosting + domain + addons + maintenance;

            totalDisplay.innerText = 'KES ' + total.toLocaleString();
        };

        quoteForm.addEventListener('change', calculateTotal);

        // Initial Calculation
        calculateTotal();

        // "Proceed with Quote" Button Logic
        const proceedBtn = document.getElementById('btn-proceed-quote');
        if (proceedBtn) {
            proceedBtn.addEventListener('click', () => {
                const siteTypeSelect = document.getElementById('site-type');
                const siteTypeText = siteTypeSelect.options[siteTypeSelect.selectedIndex].text;
                const siteTypePrice = parseInt(siteTypeSelect.value) || 0;

                const hostingEl = quoteForm.querySelector('input[name="hosting"]:checked');
                // FIX: closest('.radio-box') was failing because input is a sibling of .radio-box, not a child.
                // Using closest('label') or the wrapper class .tech-radio
                const hostingText = hostingEl ? hostingEl.closest('.tech-radio').querySelector('.r-title').innerText : 'None';
                const hostingPrice = hostingEl ? parseInt(hostingEl.value) : 0;

                const domainSelect = document.getElementById('domain-select');
                const domainText = domainSelect.options[domainSelect.selectedIndex].text;
                const domainPrice = parseInt(domainSelect.value) || 0;

                const addons = [];
                quoteForm.querySelectorAll('input[name="addon"]:checked').forEach(cb => {
                    // FIX: Same here, accessing via parent wrapper
                    const label = cb.closest('.tech-checkbox').querySelector('.check-box span:last-child').innerText;
                    addons.push(label);
                });
                quoteForm.querySelectorAll('input[name="maintenance"]:checked').forEach(cb => {
                    const label = cb.closest('.tech-checkbox').querySelector('.check-box span:last-child').innerText;
                    addons.push(label);
                });

                const totalText = totalDisplay.innerText;

                const quoteData = {
                    service: { name: siteTypeText, price: siteTypePrice },
                    hosting: { name: hostingText, price: hostingPrice },
                    domain: { name: domainText, price: domainPrice },
                    addons: addons,
                    total: totalText
                };

                const quoteString = encodeURIComponent(JSON.stringify(quoteData));
                window.location.href = `order.html?quote_data=${quoteString}`;
            });
        }
    }
});
// Domain Availability Checker (Google DNS API)
async function checkDomain() {
    const input = document.getElementById('domain-search-input');
    const resultDiv = document.getElementById('domain-result');
    let domain = input.value.trim();

    if (!domain) {
        resultDiv.innerHTML = '<span style="color: #d9534f;">Please enter a domain name.</span>';
        return;
    }

    // Add default extension if missing (optional, but good UX)
    if (!domain.includes('.')) {
        domain += '.co.ke';
        input.value = domain;
    }

    resultDiv.innerHTML = '<span style="color: #002c5f;"><i class="fas fa-spinner fa-spin"></i> Checking availability...</span>';

    try {
        // Use Google's Public DNS API
        const response = await fetch(`https://dns.google/resolve?name=${domain}`);
        const data = await response.json();

        // Status 0 = NOERROR (Domain Exists/Taken)
        // Status 3 = NXDOMAIN (Domain Not Found/Available)
        if (data.Status === 3) {
            resultDiv.innerHTML = `<span style="color: #28a745;"><i class="fas fa-check-circle"></i> <strong>${domain}</strong> is Available!</span>`;
        } else if (data.Status === 0) {
            resultDiv.innerHTML = `<span style="color: #dc3545;"><i class="fas fa-times-circle"></i> <strong>${domain}</strong> is Taken.</span>`;
        } else {
            resultDiv.innerHTML = `<span style="color: #ffa500;">Status Unknown. Please try again.</span>`;
        }
    } catch (error) {
        console.error('DNS Check Error:', error);
        resultDiv.innerHTML = '<span style="color: #d9534f;">Connection Error. Could not verify.</span>';
    }
}
