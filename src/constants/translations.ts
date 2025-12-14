export type Language = "en" | "es";

export interface Translations {
  shell: {
    subtitle: string;
    nav: {
      browse: string;
      gallery: string;
      new: string;
      devCard: string;
      more: string;
      about: string;
      tech: string;
      links: string;
    };
    footer: string;
  };
  editor: {
    title: string;
    subtitle: string;
    loading: string;
    eventBadge: {
      location: string;
      locationLabel: string;
    };
    rsvpLink: string;
    exportButton: {
      default: string;
      exporting: string;
    };
    syncStatus: {
      idle: string;
      saving: string;
      saved: string;
      error: string;
    };
    imageControls: {
      zoom: string;
      panX: string;
      panY: string;
      reset: string;
    };
      auth: {
        title: string;
        subtitle: string;
        welcome: string;
        terms: string;
        connecting: string;
        github: string;
        twitter: string;
      };
      cardStatus: {
        editing: string;
        creating: string;
      };
      exportChoice: {
        title: string;
        overwrite: string;
        newCard: string;
        cancel: string;
      };
      share: {
        link: string;
        copied: string;
        onX: string;
        onGitHub: string;
        openingX: string;
        openingGitHub: string;
      };
  };
  about: {
    title: string;
    description1: string;
    description2: string;
    stats: {
      cities: string;
      attendees: string;
      vibes: string;
    };
    madeBy: string;
  };
  links: {
    title: string;
    whatsapp: {
      label: string;
      description: string;
    };
    x: {
      label: string;
      description: string;
      handle: string;
    };
    github: {
      label: string;
      description: string;
      handle: string;
    };
    mainSite: {
      label: string;
      description: string;
    };
  };
    form: {
    header: string;
    sections: {
      identity: string;
      profile: string;
      project: string;
      style: string;
    };
    socialHandles: {
      label: string;
      placeholder: string;
      addAnother: string;
      removeHandle: string;
      errorRequired: string;
    };
    options: string;
    maxMode: string;
    codingModel: string;
    thinkingModel: string;
    favoriteFeature: string;
    planTier: string;
    cursorSince: string;
    currentProject: {
      label: string;
      errorRequired: string;
      placeholders: string[];
    };
    techStack: string;
    polaroidTheme: {
      label: string;
      themes: {
        classic: string;
        minimal: string;
        web: string;
        sakura: string;
        tokyo: string;
        cyberpunk: string;
        matrix: string;
      };
    };
    viewPreview: string;
  };
  community: {
    title: string;
    subtitle: string;
    empty: string;
    emptySubtitle: string;
    likes: {
      like: string;
      likedBy: string;
      andOthers: string;
      loginToLike: string;
    };
    sort: {
      label: string;
      recent: string;
      mostLiked: string;
    };
    filter: {
      maxOnly: string;
    };
  };
  marquee: {
    title: string;
    subtitle: string;
    status: {
      connecting: string;
      live: string;
      updating: string;
      offline: string;
    };
    newItems: string;
    loadMore: string;
    endReached: string;
    signedOut?: {
      title: string;
      subtitle: string;
      cta: string;
    };
  };
  showcase: {
    title: string;
    subtitle: string;
  };
  gallery: {
    title: string;
    subtitle: string;
    loading: string;
    errorTitle: string;
    emptyTitle: string;
    emptySubtitle: string;
    loadingMore: string;
    allLoaded: string;
  };
  analytics: {
    loading: string;
    totalCards: string;
    maxModePct: string;
    planDistribution: string;
    topFeatures: string;
    topModels: string;
    topTechStack: string;
    noData: string;
  };
  userPolaroids: {
    title: string;
    subtitle: string;
    empty: {
      title: string;
      subtitle: string;
    };
    newCard: string;
    delete: string;
    deleteConfirm: string;
    cancel: string;
    markForPrinting: string;
    unmarkForPrinting: string;
    overridePrintMarkConfirm: string;
  };
  notifications: {
    title: string;
    empty: string;
    likedYourCard: string;
    markAllRead: string;
  };
  signedOut?: {
    hero: {
      title: string;
      subtitle: string;
      features: string[];
    };
    editorTeaser: {
      title: string;
      subtitle: string;
    };
    communityTeaser: {
      title: string;
      subtitle: string;
    };
  };
  imageUpload: {
    perfect: string;
    showBestSide: string;
    dropHere: string;
    noImage: string;
    removeImage: string;
  };
  tech: {
    back: string;
    title: string;
    subtitle: string;
    readTime: string;
    sections: {
      techStack: string;
      userFlow: string;
      architecture: string;
      features: string;
      edgeFunctions: string;
      printPipeline: string;
      cursorPrompt: string;
    };
    cursorPrompt: {
      description: string;
      copy: string;
      copied: string;
    };
    flow: {
      create: { title: string; desc: string };
      preview: { title: string; desc: string };
      export: { title: string; desc: string };
      share: { title: string; desc: string };
    };
    arch: {
      reactApp: string;
      reactAppDesc: string;
      tailwind: string;
      tailwindDesc: string;
      reactQuery: string;
      reactQueryDesc: string;
      edgeFunctions: string;
      edgeFunctionsDesc: string;
      postgres: string;
      postgresDesc: string;
      realtime: string;
      realtimeDesc: string;
      storage: string;
      storageDesc: string;
    };
    features: {
      imageCapture: { title: string; desc: string };
      themeSystem: { title: string; desc: string };
      realtimeSync: { title: string; desc: string };
      printExport: { title: string; desc: string };
      socialSharing: { title: string; desc: string };
      i18n: { title: string; desc: string };
      likes: { title: string; desc: string };
      oauth: { title: string; desc: string };
      autosave: { title: string; desc: string };
    };
    edgeFns: {
      createPolaroid: string;
      getPolaroids: string;
      getPolaroidById: string;
      getPolaroidBySlug: string;
      updatePolaroid: string;
      deletePolaroid: string;
      toggleLike: string;
      getNotifications: string;
      setMarkForPrinting: string;
      markPolaroidPrinted: string;
      getAdminPolaroids: string;
    };
    print: {
      domRender: { title: string; desc: string };
      screenshot: { title: string; desc: string };
      storage: { title: string; desc: string };
      printReady: { title: string; desc: string };
      details: {
        title: string;
        step1: { title: string; desc: string };
        step2: { title: string; desc: string };
        step3: { title: string; desc: string };
        step4: { title: string; desc: string };
      };
    };
    cta: {
      title: string;
      subtitle: string;
      button: string;
    };
    footer: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    shell: {
      subtitle: "Community coffee sessions",
      nav: {
        browse: "Browse",
        gallery: "Gallery",
        new: "New",
        devCard: "Dev card",
        more: "More",
        about: "About",
        tech: "Tech",
        links: "Links",
      },
      get footer() { return `Made with love by Walter — Cursor Ambassador for El Salvador`; },
    },
    editor: {
      title: "Cafe Cursor",
      subtitle: "Your creative space — design your dev card, share your setup, meet builders.",
      loading: "Loading your card...",
      eventBadge: {
        location: "San Salvador, 3rd ed.",
        locationLabel: "Secret location",
      },
      rsvpLink: "RSVP for the event",
      exportButton: {
        default: "Export card",
        exporting: "Exporting…",
      },
      syncStatus: {
        idle: "",
        saving: "Saving…",
        saved: "Saved",
        error: "Error saving",
      },
      imageControls: {
        zoom: "Zoom",
        panX: "Pan X",
        panY: "Pan Y",
        reset: "Reset",
      },
      auth: {
        title: "Sign in to continue",
        subtitle: "Sign in to export your card",
        welcome: "Welcome",
        terms: "By continuing, you agree to our terms of service",
        connecting: "Connecting…",
        github: "Continue with GitHub",
        twitter: "Continue with X",
      },
      cardStatus: {
        editing: "Editing existing card",
        creating: "Creating new card",
      },
      exportChoice: {
        title: "What would you like to do?",
        overwrite: "Overwrite",
        newCard: "New card",
        cancel: "Cancel",
      },
      share: {
        link: "Share link",
        copied: "Copied!",
        onX: "Share on X",
        onGitHub: "Share on GitHub",
        openingX: "Opening X…",
        openingGitHub: "Opening GitHub…",
      },
    },
    about: {
      title: "The community",
      description1: "is a global series of coworking meetups for developers building with Cursor. We gather to build, share knowledge, and connect over coffee.",
      description2: "What started as a small meetup has grown into a movement — inspiring editions across multiple cities. Not a conference, just a workspace where innovation happens side by side.",
      stats: {
        cities: "Cities",
        attendees: "Attendees",
        vibes: "Vibes",
      },
      madeBy: "Made with love by Walter — Cursor Ambassador for El Salvador",
    },
    links: {
      title: "Links",
      whatsapp: {
        label: "WhatsApp Community",
        description: "Join our community chat to connect with developers building with Cursor",
      },
      x: {
        label: "X (Twitter)",
        description: "Follow me on X for updates and tech insights",
        handle: "@wmoralesdev",
      },
      github: {
        label: "GitHub",
        description: "Check out my open source projects and contributions",
        handle: "@wmoralesdev",
      },
      mainSite: {
        label: "Main Site",
        description: "Return to the Cafe Cursor homepage",
      },
    },
    form: {
      header: "Your profile",
      sections: {
        identity: "Identity",
        profile: "Profile",
        project: "Project",
        style: "Style",
      },
      socialHandles: {
        label: "Social handles",
        placeholder: "yourhandle",
        addAnother: "Add another",
        removeHandle: "Remove",
        errorRequired: "At least one handle is required",
      },
      options: "Options",
      maxMode: "Max mode",
      codingModel: "Coding model",
      thinkingModel: "Thinking model",
      favoriteFeature: "Favorite feature",
      planTier: "Plan",
      cursorSince: "Using Cursor since",
      currentProject: {
        label: "Current project",
        errorRequired: "Project is required",
        placeholders: [
          "e.g. A side project I'm excited about",
          "e.g. Something I've always wanted to build",
          "e.g. A tool that solves a real problem",
          "e.g. An open source contribution",
          "e.g. My startup MVP",
        ],
      },
      techStack: "Tech stack (max 4)",
      polaroidTheme: {
        label: "Card style",
        themes: {
          classic: "Classic",
          minimal: "Minimal",
          web: "Web",
          sakura: "Sakura",
          tokyo: "Tokyo",
          cyberpunk: "Cyber",
          matrix: "Matrix",
        },
      },
      viewPreview: "View preview",
    },
    community: {
      title: "Community",
      subtitle: "See what the community is building",
      empty: "No community cards yet",
      emptySubtitle: "Be the first to create a card",
      likes: {
        like: "Like",
        likedBy: "Liked by",
        andOthers: "and {count} others",
        loginToLike: "Sign in to like",
      },
      sort: {
        label: "Sort",
        recent: "Most recent",
        mostLiked: "Most liked",
      },
      filter: {
        maxOnly: "MAX only",
      },
    },
    showcase: {
      title: "Cafe Cursor around the world",
      subtitle: "A glimpse into our global community",
    },
    gallery: {
      title: "Built by the Community",
      subtitle: "Every card tells a story. Discover the developers behind the code.",
      loading: "Loading polaroids...",
      errorTitle: "Error loading polaroids",
      emptyTitle: "No polaroids yet",
      emptySubtitle: "Be the first to create one!",
      loadingMore: "Loading more...",
      allLoaded: "All polaroids loaded",
    },
    analytics: {
      loading: "Loading analytics...",
      totalCards: "Total Cards",
      maxModePct: "using Max mode",
      planDistribution: "Plan Distribution",
      topFeatures: "Top Features",
      topModels: "Top Models",
      topTechStack: "Top Tech Stack",
      noData: "No data",
    },
    marquee: {
      title: "Live wall",
      subtitle: "All community cards in real-time",
      status: {
        connecting: "Connecting…",
        live: "Live",
        updating: "Updating",
        offline: "Offline",
      },
      newItems: "New",
      loadMore: "Loading more…",
      endReached: "You've reached the end",
      signedOut: {
        title: "Join the community",
        subtitle: "See what builders are sharing — sign in to add yours",
        cta: "Join now",
      },
    },
    userPolaroids: {
      title: "Your cards",
      subtitle: "Previously generated cards",
      empty: {
        title: "No cards yet",
        subtitle: "Create your first card above",
      },
      newCard: "New card",
      delete: "Delete",
      deleteConfirm: "Are you sure you want to delete this card? This action cannot be undone.",
      cancel: "Cancel",
      markForPrinting: "Mark for printing",
      unmarkForPrinting: "Unmark",
      overridePrintMarkConfirm: "You already have a card marked for printing. Do you want to replace it with this one?",
    },
    notifications: {
      title: "Notifications",
      empty: "No notifications yet",
      likedYourCard: "liked your card",
      markAllRead: "Mark all as read",
    },
    signedOut: {
      hero: {
        title: "Cafe Cursor",
        subtitle: "Create your developer identity — polaroid-style cards for the builder community.",
        features: [
          "Design a unique polaroid-style dev card",
          "Customize themes, badges, and your tech stack",
          "Export high-res prints or share online",
        ],
      },
      editorTeaser: {
        title: "Create your dev card",
        subtitle: "Sign in to design and export your personalized dev card",
      },
      communityTeaser: {
        title: "Browse the community",
        subtitle: "Sign in to explore cards from developers around the world",
      },
    },
    imageUpload: {
      perfect: "Perfect",
      showBestSide: "Show your best side",
      dropHere: "Drop your photo here",
      noImage: "No image",
      removeImage: "Remove image",
    },
    tech: {
      back: "Back",
      title: "Under the Hood",
      subtitle: "A technical look at how we built the Cafe Cursor card experience.",
      readTime: "{minutes} min read",
      sections: {
        techStack: "Tech Stack",
        userFlow: "User Flow",
        architecture: "Architecture",
        features: "Technical Features",
        edgeFunctions: "Edge Functions",
        printPipeline: "Print Pipeline",
        cursorPrompt: "Prompt starter for Cursor",
      },
      cursorPrompt: {
        description: "This is a starter prompt to help you build this application with Cursor. Copy and paste it into Cursor, then work iteratively—build incrementally, test frequently, and refine as you go:",
        copy: "Copy Prompt",
        copied: "Copied!",
      },
      flow: {
        create: { title: "Create", desc: "Fill your profile, pick a theme, upload a photo" },
        preview: { title: "Preview", desc: "See live preview with 3D tilt effect" },
        export: { title: "Export", desc: "Download high-res PNG for printing" },
        share: { title: "Share", desc: "Post to X or share via unique link" },
      },
      arch: {
        reactApp: "React 19",
        reactAppDesc: "TypeScript + Vite",
        tailwind: "Tailwind 4",
        tailwindDesc: "CSS Variables",
        reactQuery: "React Query",
        reactQueryDesc: "Server State",
        edgeFunctions: "Edge Functions",
        edgeFunctionsDesc: "Deno Runtime · Global Edge",
        postgres: "PostgreSQL",
        postgresDesc: "Row Level Security",
        realtime: "Realtime",
        realtimeDesc: "Live Updates",
        storage: "Storage",
        storageDesc: "CDN-backed",
      },
      features: {
        imageCapture: { title: "Image Capture", desc: "Drop or upload your photo, adjust zoom and pan for the perfect crop within the polaroid frame." },
        themeSystem: { title: "Theme System", desc: "7 unique card themes (Classic, Minimal, Web, Sakura, Tokyo, Cyberpunk, Matrix) with themed stamps and tape strips." },
        realtimeSync: { title: "Real-time Sync", desc: "Auto-save to Supabase with optimistic updates. Your cards sync across devices instantly." },
        printExport: { title: "Print-Ready Export", desc: "White background preserved for physical printing. Export at high resolution for perfect prints." },
        socialSharing: { title: "Social Sharing", desc: "Share your card on X or copy a direct link. Each card gets a unique shareable URL." },
        i18n: { title: "i18n Ready", desc: "Full English and Spanish support with easy extensibility for more languages." },
        likes: { title: "Likes & Notifications", desc: "Like community cards and get notified when others like yours. Real-time notification updates." },
        oauth: { title: "OAuth Integration", desc: "Sign in with GitHub or X (Twitter) via Supabase Auth. Secure, seamless authentication flow." },
        autosave: { title: "Autosave", desc: "Form state is debounced and saved automatically. Never lose your progress." },
      },
      edgeFns: {
        createPolaroid: "Create polaroid record with profile data and source image",
        getPolaroids: "Fetch community cards with pagination & filters",
        getPolaroidById: "Get single card by ID",
        getPolaroidBySlug: "Get single card by slug for sharing",
        updatePolaroid: "Update card metadata and upload portrait image",
        deletePolaroid: "Remove card and associated storage",
        toggleLike: "Like/unlike a community card",
        getNotifications: "Fetch like notifications for user",
        setMarkForPrinting: "Mark/unmark card for printing (one per user)",
        markPolaroidPrinted: "Admin: Record print event and clear print mark",
        getAdminPolaroids: "Admin: Fetch all polaroids with search, filters, pagination",
      },
      print: {
        domRender: { 
          title: "DOM Render", 
          desc: "React component renders with white background (#ffffff), includes all styling, images, text, and theme effects" 
        },
        screenshot: { 
          title: "Screenshot", 
          desc: "modern-screenshot (domToPng) captures DOM at 4x scale (1360×1836px) for high-resolution output" 
        },
        storage: { 
          title: "Storage", 
          desc: "Data URL converted to blob, uploaded to Supabase Storage with cache-busting query params" 
        },
        printReady: { 
          title: "Print Ready", 
          desc: "Final image optimized at 340×459px (100×148mm print ratio) with 2x DPI for crisp printing" 
        },
        details: {
          title: "How it works",
          step1: {
            title: "1. Component Rendering",
            desc: "The PolaroidCard component renders with all user data: profile info, uploaded image, selected theme, badges, and stamp. The component uses a white background (#ffffff) to ensure clean printing.",
          },
          step2: {
            title: "2. High-Resolution Capture",
            desc: "Using modern-screenshot's domToPng, we capture the rendered DOM element at 4x scale. This means a 340×459px component becomes a 1360×1836px image, ensuring crisp detail when printed. A 100ms delay ensures all assets are loaded before capture.",
          },
          step3: {
            title: "3. Storage & CDN",
            desc: "The generated data URL is converted to a PNG blob and uploaded to Supabase Storage in the 'polaroids' bucket. The URL includes a timestamp query parameter (?v=timestamp) to bust CDN cache and ensure fresh images on every update.",
          },
          step4: {
            title: "4. Print Optimization",
            desc: "The final image is optimized for 100×148mm paper (4×6 inches) with two polaroids side by side. Each polaroid uses a 340×459px aspect ratio (74:100mm when rotated 90°), ensuring perfect fit without cropping borders or stamps.",
          },
        },
      },
      cta: {
        title: "Ready to create your card?",
        subtitle: "Join the Cafe Cursor community and share your setup.",
        button: "Create my card",
      },
      footer: "Made with love by Walter — Cursor Ambassador for El Salvador",
    },
  },
  es: {
    shell: {
      subtitle: "Sesiones de café comunitarias",
      nav: {
        browse: "Explorar",
        gallery: "Galería",
        new: "Nuevo",
        devCard: "Tarjeta dev",
        more: "Más",
        about: "Acerca de",
        tech: "Tech",
        links: "Enlaces",
      },
      get footer() { return `Hecho con amor por Walter — Cursor Ambassador para El Salvador`; },
    },
    editor: {
      title: "Cafe Cursor",
      subtitle: "Tu espacio creativo — diseña tu tarjeta dev, comparte tu setup, conoce builders.",
      loading: "Cargando tu tarjeta...",
      eventBadge: {
        location: "San Salvador, 3.ª ed.",
        locationLabel: "Ubicación secreta",
      },
      rsvpLink: "Confirma tu asistencia",
      exportButton: {
        default: "Exportar tarjeta",
        exporting: "Exportando…",
      },
      syncStatus: {
        idle: "",
        saving: "Guardando…",
        saved: "Guardado",
        error: "Error al guardar",
      },
      imageControls: {
        zoom: "Zoom",
        panX: "Pan X",
        panY: "Pan Y",
        reset: "Restablecer",
      },
      auth: {
        title: "Inicia sesión para continuar",
        subtitle: "Inicia sesión para exportar tu tarjeta",
        welcome: "Bienvenido",
        terms: "Al continuar, aceptas nuestros términos de servicio",
        connecting: "Conectando…",
        github: "Continuar con GitHub",
        twitter: "Continuar con X",
      },
      cardStatus: {
        editing: "Editando tarjeta existente",
        creating: "Creando nueva tarjeta",
      },
      exportChoice: {
        title: "¿Qué te gustaría hacer?",
        overwrite: "Sobrescribir",
        newCard: "Nueva tarjeta",
        cancel: "Cancelar",
      },
      share: {
        link: "Compartir enlace",
        copied: "¡Copiado!",
        onX: "Compartir en X",
        onGitHub: "Compartir en GitHub",
        openingX: "Abriendo X…",
        openingGitHub: "Abriendo GitHub…",
      },
    },
    about: {
      title: "La comunidad",
      description1: "es una serie global de meetups de coworking para desarrolladores que construyen con Cursor. Nos reunimos para construir, compartir conocimiento y conectar con buen café.",
      description2: "Lo que comenzó como un pequeño meetup se ha convertido en un movimiento — inspirando ediciones en múltiples ciudades. No es una conferencia, solo un espacio de trabajo donde la innovación ocurre lado a lado.",
      stats: {
        cities: "Ciudades",
        attendees: "Asistentes",
        vibes: "Vibes",
      },
      madeBy: "Hecho con amor por Walter — Cursor Ambassador para El Salvador",
    },
    links: {
      title: "Enlaces",
      whatsapp: {
        label: "Comunidad WhatsApp",
        description: "Únete a nuestro chat comunitario para conectar con desarrolladores que construyen con Cursor",
      },
      x: {
        label: "X (Twitter)",
        description: "Sígueme en X para actualizaciones e insights tecnológicos",
        handle: "@wmoralesdev",
      },
      github: {
        label: "GitHub",
        description: "Revisa mis proyectos open source y contribuciones",
        handle: "@wmoralesdev",
      },
      mainSite: {
        label: "Sitio principal",
        description: "Volver a la página principal de Cafe Cursor",
      },
    },
    form: {
      header: "Tu perfil",
      sections: {
        identity: "Identidad",
        profile: "Perfil",
        project: "Proyecto",
        style: "Estilo",
      },
      socialHandles: {
        label: "Redes sociales",
        placeholder: "tuhandle",
        addAnother: "Agregar otra",
        removeHandle: "Eliminar",
        errorRequired: "Se requiere al menos una red social",
      },
      options: "Opciones",
      maxMode: "Modo max",
      codingModel: "Modelo de código",
      thinkingModel: "Modelo de pensamiento",
      favoriteFeature: "Característica favorita",
      planTier: "Plan",
      cursorSince: "Usando Cursor desde",
      currentProject: {
        label: "Proyecto actual",
        errorRequired: "El proyecto es obligatorio",
        placeholders: [
          "ej. Un proyecto que me emociona",
          "ej. Algo que siempre quise construir",
          "ej. Una herramienta que resuelve un problema real",
          "ej. Una contribución open source",
          "ej. El MVP de mi startup",
        ],
      },
      techStack: "Tech stack (máx. 4)",
      polaroidTheme: {
        label: "Estilo de tarjeta",
        themes: {
          classic: "Clásico",
          minimal: "Minimal",
          web: "Web",
          sakura: "Sakura",
          tokyo: "Tokio",
          cyberpunk: "Cyber",
          matrix: "Matrix",
        },
      },
      viewPreview: "Ver vista previa",
    },
    community: {
      title: "Comunidad",
      subtitle: "Mira lo que la comunidad está construyendo",
      empty: "Aún no hay tarjetas de la comunidad",
      emptySubtitle: "Sé el primero en crear una tarjeta",
      likes: {
        like: "Me gusta",
        likedBy: "Le gustó a",
        andOthers: "y {count} más",
        loginToLike: "Inicia sesión para dar like",
      },
      sort: {
        label: "Ordenar",
        recent: "Más recientes",
        mostLiked: "Más gustados",
      },
      filter: {
        maxOnly: "Solo MAX",
      },
    },
    showcase: {
      title: "Cafe Cursor alrededor del mundo",
      subtitle: "Un vistazo a nuestra comunidad global",
    },
    gallery: {
      title: "Construido por la Comunidad",
      subtitle: "Cada tarjeta cuenta una historia. Descubre a los desarrolladores detrás del código.",
      loading: "Cargando polaroids...",
      errorTitle: "Error al cargar polaroids",
      emptyTitle: "Aún no hay polaroids",
      emptySubtitle: "¡Sé el primero en crear una!",
      loadingMore: "Cargando más...",
      allLoaded: "Todas las polaroids cargadas",
    },
    analytics: {
      loading: "Cargando analíticas...",
      totalCards: "Total de Tarjetas",
      maxModePct: "usando Max mode",
      planDistribution: "Distribución de Planes",
      topFeatures: "Características Populares",
      topModels: "Modelos Populares",
      topTechStack: "Tech Stack Popular",
      noData: "Sin datos",
    },
    marquee: {
      title: "Muro en vivo",
      subtitle: "Todas las tarjetas de la comunidad en tiempo real",
      status: {
        connecting: "Conectando…",
        live: "En vivo",
        updating: "Actualizando",
        offline: "Sin conexión",
      },
      newItems: "Nuevo",
      loadMore: "Cargando más…",
      endReached: "Has llegado al final",
      signedOut: {
        title: "Únete a la comunidad",
        subtitle: "Mira lo que los builders están compartiendo — inicia sesión para agregar la tuya",
        cta: "Únete ahora",
      },
    },
    userPolaroids: {
      title: "Tus tarjetas",
      subtitle: "Tarjetas generadas anteriormente",
      empty: {
        title: "Aún no hay tarjetas",
        subtitle: "Crea tu primera tarjeta arriba",
      },
      newCard: "Nueva tarjeta",
      delete: "Eliminar",
      deleteConfirm: "¿Estás seguro de que quieres eliminar esta tarjeta? Esta acción no se puede deshacer.",
      cancel: "Cancelar",
      markForPrinting: "Marcar para imprimir",
      unmarkForPrinting: "Desmarcar",
      overridePrintMarkConfirm: "Ya tienes una tarjeta marcada para imprimir. ¿Quieres reemplazarla con esta?",
    },
    notifications: {
      title: "Notificaciones",
      empty: "Aún no hay notificaciones",
      likedYourCard: "le gustó tu tarjeta",
      markAllRead: "Marcar todo como leído",
    },
    signedOut: {
      hero: {
        title: "Cafe Cursor",
        subtitle: "Crea tu identidad de desarrollador — tarjetas estilo polaroid para la comunidad builder.",
        features: [
          "Diseña una tarjeta dev única estilo polaroid",
          "Personaliza temas, badges y tu tech stack",
          "Exporta impresiones de alta resolución o comparte online",
        ],
      },
      editorTeaser: {
        title: "Crea tu tarjeta dev",
        subtitle: "Inicia sesión para diseñar y exportar tu tarjeta dev personalizada",
      },
      communityTeaser: {
        title: "Explora la comunidad",
        subtitle: "Inicia sesión para explorar tarjetas de desarrolladores de todo el mundo",
      },
    },
    imageUpload: {
      perfect: "Perfecto",
      showBestSide: "Muestra tu mejor lado",
      dropHere: "Suelta tu foto aquí",
      noImage: "Sin imagen",
      removeImage: "Eliminar imagen",
    },
    tech: {
      back: "Volver",
      title: "Bajo el capó",
      subtitle: "Una mirada técnica a cómo construimos la experiencia de tarjetas de Cafe Cursor.",
      readTime: "{minutes} min de lectura",
      sections: {
        techStack: "Stack tecnológico",
        userFlow: "Flujo del usuario",
        architecture: "Arquitectura",
        features: "Características técnicas",
        edgeFunctions: "Edge Functions",
        printPipeline: "Pipeline de impresión",
        cursorPrompt: "Prompt inicial para Cursor",
      },
      cursorPrompt: {
        description: "Este es un prompt inicial para ayudarte a construir esta aplicación con Cursor. Cópialo y pégalo en Cursor, luego trabaja de forma iterativa—construye incrementalmente, prueba frecuentemente y refina mientras avanzas:",
        copy: "Copiar prompt",
        copied: "¡Copiado!",
      },
      flow: {
        create: { title: "Crear", desc: "Completa tu perfil, elige un tema, sube una foto" },
        preview: { title: "Vista previa", desc: "Ve la vista previa en vivo con efecto 3D" },
        export: { title: "Exportar", desc: "Descarga PNG en alta resolución para imprimir" },
        share: { title: "Compartir", desc: "Publica en X o comparte con un enlace único" },
      },
      arch: {
        reactApp: "React 19",
        reactAppDesc: "TypeScript + Vite",
        tailwind: "Tailwind 4",
        tailwindDesc: "Variables CSS",
        reactQuery: "React Query",
        reactQueryDesc: "Estado del servidor",
        edgeFunctions: "Edge Functions",
        edgeFunctionsDesc: "Deno Runtime · Edge Global",
        postgres: "PostgreSQL",
        postgresDesc: "Row Level Security",
        realtime: "Realtime",
        realtimeDesc: "Actualizaciones en vivo",
        storage: "Storage",
        storageDesc: "Respaldado por CDN",
      },
      features: {
        imageCapture: { title: "Captura de imagen", desc: "Arrastra o sube tu foto, ajusta zoom y posición para el recorte perfecto en el marco." },
        themeSystem: { title: "Sistema de temas", desc: "7 temas únicos (Clásico, Minimal, Web, Sakura, Tokio, Cyberpunk, Matrix) con sellos y cintas temáticas." },
        realtimeSync: { title: "Sincronización en tiempo real", desc: "Autoguardado en Supabase con actualizaciones optimistas. Tus tarjetas se sincronizan al instante." },
        printExport: { title: "Exportación para impresión", desc: "Fondo blanco preservado para impresión física. Exporta en alta resolución." },
        socialSharing: { title: "Compartir en redes", desc: "Comparte tu tarjeta en X o copia un enlace directo. Cada tarjeta tiene una URL única." },
        i18n: { title: "Internacionalización", desc: "Soporte completo en inglés y español con fácil extensibilidad para más idiomas." },
        likes: { title: "Likes y notificaciones", desc: "Da like a tarjetas de la comunidad y recibe notificaciones cuando otros den like a las tuyas." },
        oauth: { title: "Integración OAuth", desc: "Inicia sesión con GitHub o X (Twitter) vía Supabase Auth. Autenticación segura y fluida." },
        autosave: { title: "Autoguardado", desc: "El estado del formulario se guarda automáticamente con debounce. Nunca pierdas tu progreso." },
      },
      edgeFns: {
        createPolaroid: "Crear registro de polaroid con datos de perfil e imagen fuente",
        getPolaroids: "Obtener tarjetas de la comunidad con paginación y filtros",
        getPolaroidById: "Obtener tarjeta por ID",
        getPolaroidBySlug: "Obtener tarjeta por slug para compartir",
        updatePolaroid: "Actualizar metadatos y subir imagen de retrato",
        deletePolaroid: "Eliminar tarjeta y almacenamiento asociado",
        toggleLike: "Dar/quitar like a una tarjeta de la comunidad",
        getNotifications: "Obtener notificaciones de likes del usuario",
        setMarkForPrinting: "Marcar/desmarcar tarjeta para impresión (una por usuario)",
        markPolaroidPrinted: "Admin: Registrar evento de impresión y limpiar marca",
        getAdminPolaroids: "Admin: Obtener todas las polaroids con búsqueda, filtros, paginación",
      },
      print: {
        domRender: { 
          title: "Render DOM", 
          desc: "Componente React renderiza con fondo blanco (#ffffff), incluye todos los estilos, imágenes, texto y efectos temáticos" 
        },
        screenshot: { 
          title: "Captura", 
          desc: "modern-screenshot (domToPng) captura el DOM a escala 4x (1360×1836px) para salida de alta resolución" 
        },
        storage: { 
          title: "Storage", 
          desc: "Data URL convertida a blob, subida a Supabase Storage con parámetros de consulta para invalidar caché" 
        },
        printReady: { 
          title: "Listo para imprimir", 
          desc: "Imagen final optimizada a 340×459px (ratio de impresión 100×148mm) con 2x DPI para impresión nítida" 
        },
        details: {
          title: "Cómo funciona",
          step1: {
            title: "1. Renderizado de componente",
            desc: "El componente PolaroidCard renderiza con todos los datos del usuario: información del perfil, imagen subida, tema seleccionado, badges y sello. El componente usa fondo blanco (#ffffff) para asegurar impresión limpia.",
          },
          step2: {
            title: "2. Captura de alta resolución",
            desc: "Usando domToPng de modern-screenshot, capturamos el elemento DOM renderizado a escala 4x. Esto significa que un componente de 340×459px se convierte en una imagen de 1360×1836px, asegurando detalles nítidos al imprimir. Un retraso de 100ms asegura que todos los recursos estén cargados antes de la captura.",
          },
          step3: {
            title: "3. Storage y CDN",
            desc: "El data URL generado se convierte a un blob PNG y se sube a Supabase Storage en el bucket 'polaroids'. La URL incluye un parámetro de consulta de timestamp (?v=timestamp) para invalidar la caché del CDN y asegurar imágenes frescas en cada actualización.",
          },
          step4: {
            title: "4. Optimización para impresión",
            desc: "La imagen final está optimizada para papel de 100×148mm (4×6 pulgadas) con dos polaroids lado a lado. Cada polaroid usa un ratio de aspecto de 340×459px (74:100mm cuando se rota 90°), asegurando ajuste perfecto sin recortar bordes o sellos.",
          },
        },
      },
      cta: {
        title: "¿Listo para crear tu tarjeta?",
        subtitle: "Únete a la comunidad de Cafe Cursor y comparte tu setup.",
        button: "Crear mi tarjeta",
      },
      footer: "Hecho con amor por Walter — Cursor Ambassador para El Salvador",
    },
  },
};
