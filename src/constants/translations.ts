export type Language = "en" | "es";

export interface Translations {
  shell: {
    subtitle: string;
    nav: {
      devCard: string;
      about: string;
      tech: string;
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
  form: {
    header: string;
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
  };
  community: {
    title: string;
    subtitle: string;
    empty: string;
    emptySubtitle: string;
    swipe?: {
      loading: string;
      caughtUp: string;
      seeAgain: string;
      pass: string;
      connect: string;
      matchGreat: string;
      matchGood: string;
      matchSome: string;
      modelLabel: string;
      signInPrompt: string;
      signInPromptSubtitle: string;
    };
    tabs?: {
      discover: string;
      history: string;
      matches: string;
    };
    history?: {
      loading: string;
      connected: string;
      passed: string;
      emptyConnected: string;
      emptyConnectedSubtitle: string;
      emptyPassed: string;
      emptyPassedSubtitle: string;
      emptyMatches: string;
      emptyMatchesSubtitle: string;
      matchedLabel: string;
      mutualMatch: string;
      buildingLabel: string;
      connectButton: string;
    };
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
  showcase: {
    title: string;
    subtitle: string;
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
  };
  notifications: {
    title: string;
    empty: string;
    likedYourCard: string;
    markAllRead: string;
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
      getPolaroidBySlug: string;
      updatePolaroid: string;
      deletePolaroid: string;
      postPolaroid: string;
      toggleLike: string;
      getNotifications: string;
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
        devCard: "Dev card",
        about: "About",
        tech: "Tech",
      },
      get footer() { return `Made with love by Walter — Cursor Ambassador for El Salvador`; },
    },
    editor: {
      title: "Join the session",
      subtitle: "Create your dev card — share your setup, meet others, enjoy good coffee.",
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
    form: {
      header: "Your profile",
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
    },
    community: {
      title: "Community cards",
      subtitle: "See what others are building",
      empty: "No community cards yet",
      emptySubtitle: "Connect with other developers — you won't see your own cards here",
      swipe: {
        loading: "Loading community cards...",
        caughtUp: "You're all caught up.",
        seeAgain: "See again",
        pass: "Pass",
        connect: "Connect",
        matchGreat: "Great fit",
        matchGood: "Good fit",
        matchSome: "Some overlap",
        modelLabel: "Model",
        signInPrompt: "Sign in to see people to connect with",
        signInPromptSubtitle: "Create your dev card and start connecting with the community",
      },
      tabs: {
        discover: "Discover",
        history: "History",
        matches: "Matches",
      },
      history: {
        loading: "Loading history...",
        connected: "Connected",
        passed: "Passed",
        emptyConnected: "No connections yet",
        emptyConnectedSubtitle: "Swipe right on cards to connect",
        emptyPassed: "No passed cards yet",
        emptyPassedSubtitle: "Passed cards will appear here",
        emptyMatches: "No matches yet",
        emptyMatchesSubtitle: "When someone you connect with also connects with you, they'll appear here",
        matchedLabel: "Matched",
        mutualMatch: "Match",
        buildingLabel: "Building",
        connectButton: "Connect",
      },
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
    },
    notifications: {
      title: "Notifications",
      empty: "No notifications yet",
      likedYourCard: "liked your card",
      markAllRead: "Mark all as read",
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
      sections: {
        techStack: "Tech Stack",
        userFlow: "User Flow",
        architecture: "Architecture",
        features: "Technical Features",
        edgeFunctions: "Edge Functions",
        printPipeline: "Print Pipeline",
        cursorPrompt: "Generate with Cursor",
      },
      cursorPrompt: {
        description: "Copy this detailed prompt and paste it into Cursor to generate this entire application:",
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
        themeSystem: { title: "Theme System", desc: "5 unique card themes (Classic, Minimal, Coffee, Zen, Tokyo) with themed stamps and tape strips." },
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
        getPolaroidBySlug: "Get single card by slug for sharing",
        updatePolaroid: "Update card metadata and upload portrait image",
        deletePolaroid: "Remove card and associated storage",
        postPolaroid: "Upload exported card image to storage",
        toggleLike: "Like/unlike a community card",
        getNotifications: "Fetch like notifications for user",
        getAdminPolaroids: "Admin: Fetch all polaroids with search, filters, pagination",
      },
      print: {
        domRender: { 
          title: "DOM Render", 
          desc: "React component renders with white background (#ffffff), includes all styling, images, text, and theme effects" 
        },
        screenshot: { 
          title: "Screenshot", 
          desc: "modern-screenshot (domToPng) captures DOM at 4x scale (1360×2040px) for high-resolution output" 
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
        devCard: "Tarjeta dev",
        about: "Acerca de",
        tech: "Tech",
      },
      get footer() { return `Hecho con amor por Walter — Cursor Ambassador para El Salvador`; },
    },
    editor: {
      title: "Únete a la sesión",
      subtitle: "Crea tu tarjeta dev — comparte tu configuración, conoce gente, disfruta buen café.",
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
    form: {
      header: "Tu perfil",
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
    },
    community: {
      title: "Tarjetas de la comunidad",
      subtitle: "Ve lo que otros están construyendo",
      empty: "Aún no hay tarjetas de la comunidad",
      emptySubtitle: "Conecta con otros desarrolladores — no verás tus propias tarjetas aquí",
      swipe: {
        loading: "Cargando tarjetas de la comunidad...",
        caughtUp: "Ya viste todo.",
        seeAgain: "Ver de nuevo",
        pass: "Omitir",
        connect: "Conectar",
        matchGreat: "Gran afinidad",
        matchGood: "Buena afinidad",
        matchSome: "Algo en común",
        modelLabel: "Modelo",
        signInPrompt: "Inicia sesión para ver personas con las que conectar",
        signInPromptSubtitle: "Crea tu tarjeta dev y comienza a conectar con la comunidad",
      },
      tabs: {
        discover: "Descubrir",
        history: "Historial",
        matches: "Coincidencias",
      },
      history: {
        loading: "Cargando historial...",
        connected: "Conectados",
        passed: "Omitidos",
        emptyConnected: "Aún no hay conexiones",
        emptyConnectedSubtitle: "Desliza a la derecha para conectar",
        emptyPassed: "Aún no has omitido tarjetas",
        emptyPassedSubtitle: "Las tarjetas omitidas aparecerán aquí",
        emptyMatches: "Aún no hay coincidencias",
        emptyMatchesSubtitle: "Cuando alguien con quien conectes también conecte contigo, aparecerá aquí",
        matchedLabel: "Coincidencia",
        mutualMatch: "Match",
        buildingLabel: "Construyendo",
        connectButton: "Conectar",
      },
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
    },
    notifications: {
      title: "Notificaciones",
      empty: "Aún no hay notificaciones",
      likedYourCard: "le gustó tu tarjeta",
      markAllRead: "Marcar todo como leído",
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
      sections: {
        techStack: "Stack Tecnológico",
        userFlow: "Flujo del Usuario",
        architecture: "Arquitectura",
        features: "Características Técnicas",
        edgeFunctions: "Edge Functions",
        printPipeline: "Pipeline de Impresión",
        cursorPrompt: "Generar con Cursor",
      },
      cursorPrompt: {
        description: "Copia este prompt detallado y pégalo en Cursor para generar toda esta aplicación:",
        copy: "Copiar Prompt",
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
        reactQueryDesc: "Estado del Servidor",
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
        imageCapture: { title: "Captura de Imagen", desc: "Arrastra o sube tu foto, ajusta zoom y posición para el recorte perfecto en el marco." },
        themeSystem: { title: "Sistema de Temas", desc: "5 temas únicos (Clásico, Minimal, Café, Zen, Tokio) con sellos y cintas temáticas." },
        realtimeSync: { title: "Sincronización en Tiempo Real", desc: "Autoguardado en Supabase con actualizaciones optimistas. Tus tarjetas se sincronizan al instante." },
        printExport: { title: "Exportación para Impresión", desc: "Fondo blanco preservado para impresión física. Exporta en alta resolución." },
        socialSharing: { title: "Compartir en Redes", desc: "Comparte tu tarjeta en X o copia un enlace directo. Cada tarjeta tiene una URL única." },
        i18n: { title: "Internacionalización", desc: "Soporte completo en inglés y español con fácil extensibilidad para más idiomas." },
        likes: { title: "Likes y Notificaciones", desc: "Da like a tarjetas de la comunidad y recibe notificaciones cuando otros den like a las tuyas." },
        oauth: { title: "Integración OAuth", desc: "Inicia sesión con GitHub o X (Twitter) vía Supabase Auth. Autenticación segura y fluida." },
        autosave: { title: "Autoguardado", desc: "El estado del formulario se guarda automáticamente con debounce. Nunca pierdas tu progreso." },
      },
      edgeFns: {
        createPolaroid: "Crear registro de polaroid con datos de perfil e imagen fuente",
        getPolaroids: "Obtener tarjetas de la comunidad con paginación y filtros",
        getPolaroidBySlug: "Obtener tarjeta por slug para compartir",
        updatePolaroid: "Actualizar metadatos y subir imagen de retrato",
        deletePolaroid: "Eliminar tarjeta y almacenamiento asociado",
        postPolaroid: "Subir imagen de tarjeta exportada al storage",
        toggleLike: "Dar/quitar like a una tarjeta de la comunidad",
        getNotifications: "Obtener notificaciones de likes del usuario",
        getAdminPolaroids: "Admin: Obtener todas las polaroids con búsqueda, filtros, paginación",
      },
      print: {
        domRender: { 
          title: "Render DOM", 
          desc: "Componente React renderiza con fondo blanco (#ffffff), incluye todos los estilos, imágenes, texto y efectos temáticos" 
        },
        screenshot: { 
          title: "Captura", 
          desc: "modern-screenshot (domToPng) captura el DOM a escala 4x (1360×2040px) para salida de alta resolución" 
        },
        storage: { 
          title: "Storage", 
          desc: "Data URL convertida a blob, subida a Supabase Storage con parámetros de consulta para invalidar caché" 
        },
        printReady: { 
          title: "Listo para Imprimir", 
          desc: "Imagen final optimizada a 340×459px (ratio de impresión 100×148mm) con 2x DPI para impresión nítida" 
        },
        details: {
          title: "Cómo funciona",
          step1: {
            title: "1. Renderizado de Componente",
            desc: "El componente PolaroidCard renderiza con todos los datos del usuario: información del perfil, imagen subida, tema seleccionado, badges y sello. El componente usa fondo blanco (#ffffff) para asegurar impresión limpia.",
          },
          step2: {
            title: "2. Captura de Alta Resolución",
            desc: "Usando domToPng de modern-screenshot, capturamos el elemento DOM renderizado a escala 4x. Esto significa que un componente de 340×459px se convierte en una imagen de 1360×1836px, asegurando detalles nítidos al imprimir. Un retraso de 100ms asegura que todos los recursos estén cargados antes de la captura.",
          },
          step3: {
            title: "3. Storage y CDN",
            desc: "El data URL generado se convierte a un blob PNG y se sube a Supabase Storage en el bucket 'polaroids'. La URL incluye un parámetro de consulta de timestamp (?v=timestamp) para invalidar la caché del CDN y asegurar imágenes frescas en cada actualización.",
          },
          step4: {
            title: "4. Optimización para Impresión",
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
