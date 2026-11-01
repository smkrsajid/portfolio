/*
 * CREATIVO - YOUR EDITABLE CONTENT
 * No build step, account, API key or framework is required.
 * Keep this file beside index.html. Change the values, save, and refresh.
 * See README.md for video examples and contact setup.
 */
window.CREATIVO_CONTENT = {
  name: "Creativo",
  heroDescription: "Turning ideas into moving experiences. Video editing and motion design that make people stop, feel, and remember.",
  aboutLead: "For almost four years, I've been creating video and motion design for international clients, agencies, SaaS teams, and creators.",
  aboutBody: "I combine storytelling, editing, design, and movement to make ideas easier to understand and harder to ignore. From the first rough cut to the last keyframe, I care about the details that make a video feel intentional, polished, and ready to ship.",
  tools: ["After Effects", "Premiere Pro", "DaVinci Resolve", "Illustrator", "Photoshop", "Figma"],

  // Social proof placeholders. Replace client labels and sample testimonials with real proof before publishing.
  socialProof: {
    intro: "Helping SaaS brands, agencies and creators turn ideas into polished motion and video.",
    stats: [
      { value: "4+", label: "Years creating" },
      { value: "International", label: "Client experience" },
      { value: "Video + Motion", label: "End-to-end production" },
      { value: "Global", label: "Remote collaboration" }
    ],
    clients: [
      { name: "LOGO 01", style: "serif" },
      { name: "STUDIO 02", style: "wide" },
      { name: "SAAS 03", style: "mono" },
      { name: "AGENCY 04", style: "soft" },
      { name: "BRAND 05", style: "caps" },
      { name: "CLIENT 06", style: "serif" }
    ],
    testimonials: [
      { quote: "Creativo turned a loose concept into a polished film that felt clear, considered, and completely on-brand.", name: "Client Name", role: "Creative Director · Company" },
      { quote: "The process was smooth, communication was sharp, and the final motion work gave the launch exactly the energy it needed.", name: "Client Name", role: "Founder · SaaS Company" },
      { quote: "A reliable creative partner who understands both storytelling and the details that make motion feel premium.", name: "Client Name", role: "Producer · Agency" }
    ]
  },

  showreel: {
    title: "A little motion. A lot of meaning.",
    description: "An original, silent 12-second motion study made for this website. This is a design demo, not a client showreel. Replace it with your own work in content.js.",
    type: "file", // "file", "youtube", or "vimeo"
    src: "assets/creativo-demo.mp4",
    poster: "assets/reel-poster.svg",
    badge: "DEMO REEL / 00:12",
    isDemo: true,
    // A separate, muted local MP4 used behind the hero. Set to "" for a static hero.
    backgroundSrc: "assets/creativo-demo.mp4",
    // Optional WebVTT captions for a direct video file; add your .vtt to assets/.
    captions: ""
  },

  contact: {
    // IMPORTANT: Set YOUR email to activate the mailto enquiry flow.
    // Empty by default so enquiries cannot go to an unintended recipient.
    email: "",
    // Links with an empty URL are intentionally hidden. Use complete https:// URLs.
    socials: [
      { label: "Vimeo", url: "" },
      { label: "Behance", url: "" },
      { label: "Instagram", url: "" },
      { label: "LinkedIn", url: "" }
    ]
  },

  // These are fictional, editable concepts, NOT claimed client commissions.
  // Filters are created from the categories below automatically.
  projects: [
    {
      id: "orbit",
      title: "Orbit - A simpler kind of flow",
      category: "Motion design",
      type: "Product motion",
      year: "Concept 01",
      cover: "assets/project-orbit.svg",
      coverAlt: "Orbit concept: a lime-green modular composition with black orbital shapes",
      description: "A sample product-motion concept that pairs bold shapes with a clear, confident visual rhythm. Replace this description with your project brief, creative approach, and the story behind the final film.",
      role: "Design & animation",
      tools: "After Effects / Illustrator",
      isDemo: true,
      video: { type: "file", src: "", captions: "" },
      projectUrl: ""
    },
    {
      id: "forma",
      title: "Forma - Less, but better",
      category: "Video editing",
      type: "Brand film",
      year: "Concept 02",
      cover: "assets/project-forma.svg",
      coverAlt: "Forma concept: a sculptural arch and warm architectural shadows",
      description: "An editable brand-film concept built around space, texture, and quiet confidence. Add your own film and explain the pacing, edit decisions, sound treatment, and role you played in the production.",
      role: "Editing & color",
      tools: "Premiere Pro / DaVinci Resolve",
      isDemo: true,
      video: { type: "file", src: "", captions: "" },
      projectUrl: ""
    },
    {
      id: "pulse",
      title: "Pulse - Find your rhythm",
      category: "Motion design",
      type: "Visual identity in motion",
      year: "Concept 03",
      cover: "assets/project-pulse.svg",
      coverAlt: "Pulse concept: kinetic white typography on a vibrant violet background",
      description: "A sample motion-identity direction exploring punchy typography and graphic rhythm. Replace the concept with your launch film, identity animation, or campaign, and add the actual scope and credits.",
      role: "Art direction & motion",
      tools: "After Effects / Illustrator",
      isDemo: true,
      video: { type: "file", src: "", captions: "" },
      projectUrl: ""
    },
    {
      id: "bloom",
      title: "Bloom - Room for what matters",
      category: "Product films",
      type: "SaaS explainer",
      year: "Concept 04",
      cover: "assets/project-bloom.svg",
      coverAlt: "Bloom concept: a lavender project dashboard with minimal interface cards",
      description: "An editable SaaS explainer concept with a calm interface and a simple product story. Add your product video, then describe how you turned features and workflows into a clear, watchable narrative.",
      role: "Storyboard, design & motion",
      tools: "Figma / After Effects",
      isDemo: true,
      video: { type: "file", src: "", captions: "" },
      projectUrl: ""
    },
    {
      id: "offscript",
      title: "Offscript - A human perspective",
      category: "Video editing",
      type: "Editorial storytelling",
      year: "Concept 05",
      cover: "assets/project-offscript.svg",
      coverAlt: "Offscript concept: editorial blue typography and film-strip frames",
      description: "A sample editorial-film direction focused on the human side of a story. Replace it with a founder film, documentary edit, or interview, and explain your contribution to structure, pacing, and emotion.",
      role: "Story edit & sound design",
      tools: "Premiere Pro / After Effects",
      isDemo: true,
      video: { type: "file", src: "", captions: "" },
      projectUrl: ""
    },
    {
      id: "madeof",
      title: "Made of - Small details. Big feeling.",
      category: "Product films",
      type: "Product launch",
      year: "Concept 06",
      cover: "assets/project-madeof.svg",
      coverAlt: "Made of concept: a minimal charcoal product bottle on a warm peach background",
      description: "An editable product-launch concept that gives a simple object a considered visual presence. Add your own launch film, campaign credits, and the actual production or animation techniques used.",
      role: "Creative direction & editing",
      tools: "After Effects / Premiere Pro",
      isDemo: true,
      video: { type: "file", src: "", captions: "" },
      projectUrl: ""
    }
  ],

  services: [
    {
      title: "Motion design",
      description: "Give your ideas a little momentum. Purposeful animation that brings brands, products, and complex stories to life.",
      tags: ["2D animation", "Kinetic typography", "Brand motion", "Explainers"]
    },
    {
      title: "Video editing",
      description: "Find the story in the footage. Thoughtful pacing, clean transitions, color, and sound that make every frame earn its place.",
      tags: ["Brand films", "Founder-led content", "Social content", "Color & sound"]
    },
    {
      title: "Product & SaaS films",
      description: "Show the value, not just the features. Clear, engaging product stories that help people understand what makes you different.",
      tags: ["Product launches", "UI animation", "Feature films", "Demos"]
    },
    {
      title: "Creative partnership",
      description: "A creative collaborator from the first idea to the final delivery. One connected approach to concept, design, edit, and motion.",
      tags: ["Concept development", "Storyboards", "Art direction", "Ongoing support"]
    }
  ]
};
