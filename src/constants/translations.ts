export type Language = "en" | "es";

export interface Translations {
  shell: {
    subtitle: string;
    nav: {
      devCard: string;
      about: string;
    };
    footer: string;
  };
  editor: {
    title: string;
    subtitle: string;
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
  };
  community: {
    title: string;
    subtitle: string;
    empty: string;
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
  imageUpload: {
    perfect: string;
    showBestSide: string;
    dropHere: string;
    noImage: string;
    removeImage: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    shell: {
      subtitle: "Community coffee sessions",
      nav: {
        devCard: "Dev card",
        about: "About",
      },
      get footer() { return `© ${new Date().getFullYear()} Cafe Cursor · Built for meetups worldwide`; },
    },
    editor: {
      title: "Join the session",
      subtitle: "Create your dev card — share your setup, meet others, enjoy good coffee.",
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
      madeBy: "Made with care by",
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
    },
    community: {
      title: "Community cards",
      subtitle: "See what others are building",
      empty: "No community cards yet",
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
    imageUpload: {
      perfect: "Perfect",
      showBestSide: "Show your best side",
      dropHere: "Drop your photo here",
      noImage: "No image",
      removeImage: "Remove image",
    },
  },
  es: {
    shell: {
      subtitle: "Sesiones de café comunitarias",
      nav: {
        devCard: "Tarjeta dev",
        about: "Acerca de",
      },
      get footer() { return `© ${new Date().getFullYear()} Cafe Cursor · Construido para meetups en todo el mundo`; },
    },
    editor: {
      title: "Únete a la sesión",
      subtitle: "Crea tu tarjeta dev — comparte tu configuración, conoce gente, disfruta buen café.",
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
      madeBy: "Hecho con cuidado por",
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
    },
    community: {
      title: "Tarjetas de la comunidad",
      subtitle: "Ve lo que otros están construyendo",
      empty: "Aún no hay tarjetas de la comunidad",
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
    imageUpload: {
      perfect: "Perfecto",
      showBestSide: "Muestra tu mejor lado",
      dropHere: "Suelta tu foto aquí",
      noImage: "Sin imagen",
      removeImage: "Eliminar imagen",
    },
  },
};
