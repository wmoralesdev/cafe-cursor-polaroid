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
        linkedin: string;
        twitter: string;
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
  };
  userPolaroids: {
    title: string;
    subtitle: string;
    empty: {
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
        linkedin: "Continue with LinkedIn",
        twitter: "Continue with X",
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
      techStack: "Tech stack (max 2)",
    },
    community: {
      title: "Community cards",
      subtitle: "See what others are building",
    },
    userPolaroids: {
      title: "Your cards",
      subtitle: "Previously generated cards",
      empty: {
        title: "No cards yet",
        subtitle: "Create your first card above",
      },
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
        linkedin: "Continuar con LinkedIn",
        twitter: "Continuar con X",
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
      techStack: "Stack tecnológico (máx. 2)",
    },
    community: {
      title: "Tarjetas de la comunidad",
      subtitle: "Ve lo que otros están construyendo",
    },
    userPolaroids: {
      title: "Tus tarjetas",
      subtitle: "Tarjetas generadas anteriormente",
      empty: {
        title: "Aún no hay tarjetas",
        subtitle: "Crea tu primera tarjeta arriba",
      },
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
