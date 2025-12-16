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
    initThreeJS();

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
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
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

    // Purchase Button - Redirect to Order Page
    mBtn.addEventListener('click', () => {
        // Get current service key from modal title association or store it temporarily?
        // Better way: Store the key on the opened modal or variable
        const currentService = mTitle.getAttribute('data-active-service');
        if (currentService) {
            window.location.href = `order.html?service=${currentService}`;
        }
    });

    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const serviceKey = card.getAttribute('data-service');
            const data = servicesData[serviceKey];

            if (data) {
                // Set active service key
                mTitle.setAttribute('data-active-service', serviceKey);

                mTitle.innerText = data.title;
                mIcon.className = data.icon;
                mDesc.innerText = data.desc;

                // Features
                mFeatures.innerHTML = data.features.map(f => `<span class='feature-tag'>${f}</span>`).join('');

                modal.classList.add('show');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
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

    // Attach AJAX Handler to ALL Forms (Index & Order)
    // Initialize EmailJS
    emailjs.init("I6wZRF59tQI_B8luf"); // Public Key

    // Attach Handler to ALL Forms (Index & Order)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop default FormSubmit

            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> TRANSMITTING...';
            btn.disabled = true;

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Check if item_name exists, if not try to find it in the DOM or default it
            if (!data.item_name && document.getElementById('form-item-name')) {
                data.item_name = document.getElementById('form-item-name').value;
            }
            if (!data.item_name) {
                // If this is the contact form on index, it might not have an item_name
                // Check if page URL has query param? Or just default
                data.item_name = "General Inquiry";
            }

            // Prepare EmailJS params
            // Make sure these match the {{variables}} in your template
            const templateParams = {
                name: data.name,
                email: data.email,
                phone: data.phone || 'N/A',
                message: data.message,
                item_name: data.item_name
            };

            emailjs.send('service_hem4aor', 'template_9ddo88r', templateParams)
                .then(() => {
                    // Success
                    const itemName = data.item_name || 'General Inquiry';
                    window.location.href = `thank-you.html?item=${encodeURIComponent(itemName)}`;
                }, (error) => {
                    // Failed
                    alert('SIGNAL LOST: Check your connection and try again.');
                    console.error('EmailJS Error:', error);
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                });
        });
    });
});

