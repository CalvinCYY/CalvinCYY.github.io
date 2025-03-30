document.addEventListener('DOMContentLoaded', function() {

    // Debug test to verify D3 is loaded
    console.log("D3 loaded:", typeof d3 !== 'undefined');
    if (typeof d3 === 'undefined') {
        console.error("D3.js is not loaded!");
    }

    const header = document.getElementById('main-header');
    const nav = document.getElementById('main-nav');
    const navLinks = nav.querySelectorAll('a');
    const sections = document.querySelectorAll('.content-section');
    const menuToggle = document.getElementById('menu-toggle');
    const backToTopButton = document.getElementById('back-to-top');
    const currentYearSpan = document.getElementById('current-year');
    const heroContent = document.querySelector('.hero-content');
    const skillCards = document.querySelectorAll('.skill-card');
    const projectCards = document.querySelectorAll('.project-card');

    // --- Interactive Graph Visualization ---
    function createGraphVisualization() {
        console.log("Initializing graph visualization");
        const graphContainer = document.getElementById('graph-background');
        if (!graphContainer) {
            console.error("Graph container not found");
            return;
        }

        // Clear any existing content
        graphContainer.innerHTML = '';
        
        try {
            // Get the container dimensions
            const width = graphContainer.clientWidth;
            const height = graphContainer.clientHeight;
            
            console.log(`Creating graph with dimensions: ${width}x${height}`);

            if (width === 0 || height === 0) {
                console.error("Container has zero dimensions");
                // Try again in a moment
                setTimeout(createGraphVisualization, 500);
                return;
            }
            
            // Create SVG element with a border for debugging
            const svg = d3.select('#graph-background')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .style('border', '1px solid rgba(255,255,255,0.1)'); // Subtle border for debugging

            // Generate more thematic nodes and links to represent a molecular graph
            const numNodes = Math.min(Math.floor(width / 60), 40); // Fewer nodes
            
            // Generate nodes with different types to represent atoms
            const nodeTypes = [
                { type: 'carbon', color: '#64B5F6', radius: 4 },  // Smaller
                { type: 'oxygen', color: '#EF5350', radius: 5 },  // Smaller
                { type: 'nitrogen', color: '#7E57C2', radius: 4.5 }, // Smaller
                { type: 'hydrogen', color: '#EEEEEE', radius: 3 }  // Smaller
            ];
            
            // Add a semi-transparent layer where atoms are more concentrated in top and bottom areas
            const totalNodes = numNodes;
            
            // Bias node positions to be more at the edges, less in the center where text is
            const nodes = Array.from({ length: totalNodes }, (_, i) => {
                const typeIndex = Math.floor(Math.random() * nodeTypes.length);
                
                // Position nodes more toward edges, less in center
                let x, y;
                const centerAvoidance = Math.random() < 0.7; // 70% chance to avoid center
                
                if (centerAvoidance) {
                    // Position in top or bottom third
                    if (Math.random() < 0.5) {
                        y = Math.random() * (height * 0.3); // Top third
                    } else {
                        y = height * 0.7 + Math.random() * (height * 0.3); // Bottom third
                    }
                    x = Math.random() * width;
                } else {
                    // Random position
                    x = Math.random() * width;
                    y = Math.random() * height;
                }
                
                return {
                    id: i,
                    type: nodeTypes[typeIndex].type,
                    radius: nodeTypes[typeIndex].radius + (Math.random() * 1.5 - 0.75),
                    color: nodeTypes[typeIndex].color,
                    x: x,
                    y: y
                };
            });

            // Create links to represent chemical bonds
            const links = [];
            // Create more realistic molecular-like connections
            nodes.forEach((node, i) => {
                // Connect to 1-4 nearest nodes based on type
                const maxConnections = node.type === 'carbon' ? 4 : 
                                       node.type === 'oxygen' ? 2 : 
                                       node.type === 'nitrogen' ? 3 : 1;
                
                // Find closest nodes
                const otherNodes = [...nodes];
                otherNodes.splice(i, 1); // Remove current node
                
                otherNodes.sort((a, b) => {
                    const distA = Math.hypot(node.x - a.x, node.y - a.y);
                    const distB = Math.hypot(node.x - b.x, node.y - b.y);
                    return distA - distB;
                });
                
                // Connect to closest nodes up to maxConnections
                const connections = Math.floor(Math.random() * maxConnections) + 1;
                for (let j = 0; j < Math.min(connections, otherNodes.length); j++) {
                    // Avoid duplicate links
                    if (!links.some(link => 
                        (link.source === i && link.target === otherNodes[j].id) || 
                        (link.source === otherNodes[j].id && link.target === i))
                    ) {
                        links.push({ 
                            source: i, 
                            target: otherNodes[j].id,
                            strength: Math.random() * 0.5 + 0.5 // Variable bond strength
                        });
                    }
                }
            });

            // Add enhanced glow effect
            const defs = svg.append('defs');
            const filter = defs.append('filter')
                .attr('id', 'glow');

            filter.append('feGaussianBlur')
                .attr('stdDeviation', '3.5')
                .attr('result', 'coloredBlur');

            const feMerge = filter.append('feMerge');
            feMerge.append('feMergeNode')
                .attr('in', 'coloredBlur');
            feMerge.append('feMergeNode')
                .attr('in', 'SourceGraphic');

            // Create the force simulation with improved physics
            const simulation = d3.forceSimulation(nodes)
                .force('link', d3.forceLink(links)
                    .id(d => d.id)
                    .distance(d => 60 + d.strength * 30)
                    .strength(d => d.strength * 0.5))
                .force('charge', d3.forceManyBody()
                    .strength(d => -50 - d.radius * 5))
                .force('collision', d3.forceCollide().radius(d => d.radius * 4))
                .force('x', d3.forceX(width / 2).strength(0.01))
                .force('y', d3.forceY(height / 2).strength(0.01));

            // Add links
            const link = svg.append('g')
                .selectAll('line')
                .data(links)
                .enter()
                .append('line')
                .attr('class', 'link')
                .style('stroke-opacity', d => 0.3 + d.strength * 0.4); // Stronger bonds are more visible

            // Add nodes
            const node = svg.append('g')
                .selectAll('circle')
                .data(nodes)
                .enter()
                .append('circle')
                .attr('class', 'node')
                .attr('r', d => d.radius)
                .attr('fill', d => d.color)
                .attr('opacity', 0.8)
                .call(d3.drag()
                    .on('start', dragStarted)
                    .on('drag', dragging)
                    .on('end', dragEnded));
            
            // Apply the glow effect to nodes after they're created
            node.style('filter', 'url(#glow)');

            // Add cursor movement effect - nodes move away from cursor
            svg.on('mousemove', function(event) {
                if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    const [mouseX, mouseY] = d3.pointer(event);
                    const radius = 60; // Influence radius
                    const strength = 10; // Force strength
                    
                    // Apply subtle force to nodes near the cursor
                    nodes.forEach(node => {
                        const dx = node.x - mouseX;
                        const dy = node.y - mouseY;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < radius) {
                            // Calculate force based on distance (closer = stronger)
                            const force = (1 - distance / radius) * strength;
                            
                            // Apply force direction away from cursor
                            node.vx += (dx / distance) * force;
                            node.vy += (dy / distance) * force;
                            
                            // Heat simulation slightly to allow movement
                            simulation.alpha(0.1).restart();
                        }
                    });
                }
            });

            // Interactive node behavior
            node.on('mouseover', function(event, d) {
                // Highlight connected nodes
                const connectedNodes = links.filter(l => 
                    l.source.id === d.id || l.target.id === d.id
                ).map(l => 
                    l.source.id === d.id ? l.target.id : l.source.id
                );
                
                node.attr('opacity', n => 
                    n.id === d.id || connectedNodes.includes(n.id) ? 1 : 0.3
                );
                
                // Highlight connected links
                link.style('stroke-opacity', l => 
                    l.source.id === d.id || l.target.id === d.id ? 
                    0.8 : 0.2
                ).style('stroke-width', l => 
                    l.source.id === d.id || l.target.id === d.id ? 
                    1.5 : 1
                );
                
                // Increase size of hovered node
                d3.select(this).attr('r', d.radius * 1.5);
            })
            .on('mouseout', function(event, d) {
                // Restore normal appearance
                node.attr('opacity', 0.8);
                link.style('stroke-opacity', d => 0.3 + d.strength * 0.4)
                    .style('stroke-width', 1);
                d3.select(this).attr('r', d.radius);
            });

            // Subtle animation of nodes - slower and less pronounced
            function jiggleNodes() {
                node.transition()
                    .duration(3000)  // Slower
                    .attr('r', d => d.radius + Math.random() * 0.3)  // Less movement
                    .on('end', jiggleNodes);
            }
            
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                jiggleNodes();
            }

            // Update positions on simulation tick
            simulation.on('tick', () => {
                link
                    .attr('x1', d => d.source.x)
                    .attr('y1', d => d.source.y)
                    .attr('x2', d => d.target.x)
                    .attr('y2', d => d.target.y);

                node
                    .attr('cx', d => d.x)
                    .attr('cy', d => d.y);
            });

            // Drag functions with elastic "ping back"
            function dragStarted(event, d) {
                event.sourceEvent.stopPropagation(); // Prevent parent elements from receiving the event
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
                
                // Highlight connected nodes and links when dragging
                const connectedNodes = links.filter(l => 
                    l.source.id === d.id || l.target.id === d.id
                ).map(l => 
                    l.source.id === d.id ? l.target.id : l.source.id
                );
                
                node.attr('opacity', n => 
                    n.id === d.id || connectedNodes.includes(n.id) ? 1 : 0.3
                );
                
                link.style('stroke-opacity', l => 
                    l.source.id === d.id || l.target.id === d.id ? 
                    0.8 : 0.2
                ).style('stroke-width', l => 
                    l.source.id === d.id || l.target.id === d.id ? 
                    2 : 1
                );
            }

            function dragging(event, d) {
                d.fx = event.x;
                d.fy = event.y;
            }

            function dragEnded(event, d) {
                if (!event.active) simulation.alphaTarget(0);
                
                // Restore normal appearance
                node.attr('opacity', 0.8);
                link.style('stroke-opacity', d => 0.3 + d.strength * 0.4)
                    .style('stroke-width', 1);
                    
                // Elastic "ping back" effect with physics
                const currentX = d.x;
                const currentY = d.y;
                
                d3.select(this)
                    .transition()
                    .duration(1000)
                    .ease(d3.easeBounce)
                    .tween('elasticRelease', function() {
                        const startX = d.fx;
                        const startY = d.fy;
                        return function(t) {
                            if (t < 1) {
                                // During animation, maintain fixed position
                                d.fx = startX;
                                d.fy = startY;
                            } else {
                                // After animation completes, release the node
                                d.fx = null;
                                d.fy = null;
                                
                                // Add a small impulse to make it bounce naturally
                                d.vx = (currentX - startX) * 0.1;
                                d.vy = (currentY - startY) * 0.1;
                            }
                        };
                    });
            }

            // Resize handler
            function resizeGraph() {
                const newWidth = graphContainer.clientWidth;
                const newHeight = graphContainer.clientHeight;
                
                svg.attr('width', newWidth)
                   .attr('height', newHeight);
                
                simulation.force('center', d3.forceCenter(newWidth / 2, newHeight / 2))
                          .force('x', d3.forceX(newWidth / 2).strength(0.01))
                          .force('y', d3.forceY(newHeight / 2).strength(0.01));
                simulation.alpha(0.3).restart();
            }

            // Add resize listener
            window.addEventListener('resize', resizeGraph);

            // Store resize handler for cleanup
            graphContainer._resizeHandler = resizeGraph;

            // Initial animation
            simulation.alpha(1).restart();
        } catch (error) {
            console.error("Error creating graph:", error);
        }
    }

    // Initialize graph visualization
    createGraphVisualization();

    // --- Update Copyright Year ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Add animation classes to hero elements ---
    if (heroContent) {
        // Animate hero content on load
        setTimeout(() => {
            heroContent.classList.add('visible');
        }, 300);
    }

    // --- Header Style Change on Scroll (Throttled) ---
    let lastScrollPosition = 0;
    let ticking = false;

    function handleScroll() {
        lastScrollPosition = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (lastScrollPosition > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
        
                // Back to Top Button Visibility
                if (lastScrollPosition > 300) {
                    backToTopButton.classList.add('visible');
                } else {
                    backToTopButton.classList.remove('visible');
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    }
    
    // Use passive event listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check in case page loads scrolled

    // --- Mobile Menu Toggle ---
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.querySelector('i').classList.toggle('fa-bars');
            menuToggle.querySelector('i').classList.toggle('fa-times');
            // Optional: Prevent body scroll when menu is open
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });
    }

    // --- Close Mobile Menu on Link Click or Outside Click ---
    function closeMobileMenu() {
        if (nav.classList.contains('active')) {
            nav.classList.remove('active');
            menuToggle.querySelector('i').classList.remove('fa-times');
            menuToggle.querySelector('i').classList.add('fa-bars');
            document.body.style.overflow = '';
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close menu if clicking outside of it
    document.addEventListener('click', function(event) {
        const isClickInsideNav = nav.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);

        if (!isClickInsideNav && !isClickOnToggle && nav.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // --- Lazy load images ---
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const images = document.querySelectorAll('img[loading="lazy"][data-src]');
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const lazyLoadScript = document.createElement('script');
        lazyLoadScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(lazyLoadScript);
    }

    // --- Active Link Highlighting on Scroll (Using Intersection Observer) ---
    const observerOptions = {
        root: null,
        rootMargin: `-${header.offsetHeight}px 0px -50% 0px`, // Adjust trigger point
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        if (section.id) { // Only observe sections with IDs
            sectionObserver.observe(section);
        }
    });

    // --- Enhanced Animate Elements on Scroll (Using Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% is visible
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a small delay before adding the class for smoother animation
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 100);
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Enhanced Animation for Skill Cards ---
    skillCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // --- Enhanced Animation for Project Cards ---
    projectCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.15}s`;
    });

    // --- Back to Top Button Click ---
    if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

}); // End DOMContentLoaded