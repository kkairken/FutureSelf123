export type Locale = 'en' | 'ru' | 'kz';

export const locales: Locale[] = ['en', 'ru', 'kz'];

export const defaultLocale: Locale = 'en';

export type Dictionary = {
  nav: {
    home: string;
    howItWorks: string;
    dashboard: string;
    pricing: string;
    getStarted: string;
    logout: string;
    credits: string;
    themeLight: string;
    themeDark: string;
    themeSystem: string;
  };
  home: {
    badge: string;
    hero: {
      title: string;
      subtitle: string;
      notBook: string;
    };
    cta: {
      create: string;
      howItWorks: string;
    };
    features: {
      future: {
        title: string;
        description: string;
      };
      psychology: {
        title: string;
        description: string;
      };
      personalized: {
        title: string;
        description: string;
      };
    };
    process: {
      title: string;
      steps: {
        share: string;
        choose: string;
        receive: string;
        read: string;
      };
    };
    pricing: {
      title: string;
      subtitle: string;
      single: string;
      starter: string;
      committed: string;
      monthly: string;
      chapter: string;
      chapters: string;
      perMonth: string;
      startNow: string;
    };
    footer: {
      tagline: string;
      privacy: string;
      terms: string;
    };
  };
  create: {
    title: string;
    subtitle: string;
    creditsRemaining: string;
    form: {
      bookTitle: string;
      bookTitlePlaceholder: string;
      name: string;
      namePlaceholder: string;
      currentLife: string;
      currentLifePlaceholder: string;
      pastEvents: string;
      pastEventsPlaceholder: string;
      fears: string;
      fearsPlaceholder: string;
      futureVision: string;
      futureVisionPlaceholder: string;
      archetype: string;
      tone: string;
    };
    generate: string;
    generating: string;
    timeEstimate: string;
    signInFirst: string;
    needCredits: string;
  };
  auth: {
    signIn: {
      title: string;
      subtitle: string;
      email: string;
      emailPlaceholder: string;
      sendLink: string;
      checkEmail: string;
      clickLink: string;
    };
    verify: {
      verifying: string;
      success: string;
      redirecting: string;
      failed: string;
      expired: string;
      tryAgain: string;
      welcomeNew: string;
      welcomeBack: string;
    };
    complete: {
      title: string;
      subtitle: string;
      fullName: string;
      namePlaceholder: string;
      language: string;
      complete: string;
      consentPrefix: string;
      consentOffer: string;
      consentPrivacy: string;
      consentTerms: string;
    };
  };
  dashboard: {
    welcome: string;
    welcomeBack: string;
    tagline: string;
    loading: string;
    books: {
      title: string;
      noBooks: string;
      noBooksDesc: string;
      createFirst: string;
      chaptersCount: string;
      lastUpdated: string;
      continue: string;
      startNew: string;
    };
    stats: {
      creditsRemaining: string;
      totalChapters: string;
      completed: string;
      buyMore: string;
    };
    actions: {
      createNew: string;
      getCredits: string;
    };
    chapters: {
      title: string;
      noChapters: string;
      noChaptersDesc: string;
      createFirst: string;
      ready: string;
      generating: string;
      failed: string;
      archetype: string;
      tone: string;
    };
  };
  chapter: {
    title: string;
    loading: string;
    creating: string;
    creatingDesc: string;
    timeEstimate: string;
    failed: string;
    failedDesc: string;
    tryAgain: string;
    backToDashboard: string;
    backToStory: string;
    readDaily: string;
    createAnother: string;
    copyText: string;
    copied: string;
  };
  pricing: {
    title: string;
    subtitle: string;
    plans: {
      single: string;
      singleDesc: string;
      starter: string;
      starterDesc: string;
      bundle: string;
      bundleDesc: string;
      subscription: string;
      subscriptionDesc: string;
      mostPopular: string;
    };
    features: {
      chapters: string;
      save: string;
      multiple: string;
      cancel: string;
      consistent: string;
      length: string;
      customize: string;
      journey: string;
    };
    purchase: string;
    signInToPurchase: string;
    securePayment: string;
    creditsNeverExpire: string;
    roundingNotice: string;
    ratesNotice: string;
  };
  privacy: {
    title: string;
    sections: {
      dataCollection: { title: string; body: string };
      dataUsage: { title: string; body: string };
      dataSecurity: { title: string; body: string };
      rights: { title: string; body: string };
      contact: { title: string; body: string };
    };
  };
  terms: {
    title: string;
    sections: {
      serviceDescription: { title: string; body: string };
      responsibilities: { title: string; body: string };
      credits: { title: string; body: string };
      ownership: { title: string; body: string };
      disclaimer: { title: string; body: string };
      contact: { title: string; body: string };
    };
  };
  payment: {
    processing: string;
    successTitle: string;
    successBody: string;
    createChapter: string;
    goDashboard: string;
    failedTitle: string;
    failedBody: string;
    tryAgain: string;
  };
  footer: {
    legal: string;
    offer: string;
    privacy: string;
    terms: string;
    payment: string;
    delivery: string;
    contacts: string;
    payments: string;
    freedomPay: string;
  };
  howItWorks: {
    title: string;
    subtitle: string;
    science: {
      title: string;
      p1: string;
      p2: string;
      p3: string;
    };
    process: {
      title: string;
      steps: {
        tell: {
          title: string;
          description: string;
        };
        choose: {
          title: string;
          description: string;
        };
        tone: {
          title: string;
          description: string;
        };
        generate: {
          title: string;
          description: string;
        };
        receive: {
          title: string;
          description: string;
        };
        transform: {
          title: string;
          description: string;
        };
      };
    };
    different: {
      title: string;
      points: {
        notBook: {
          title: string;
          description: string;
        };
        notAffirmations: {
          title: string;
          description: string;
        };
        notGeneric: {
          title: string;
          description: string;
        };
        notMystical: {
          title: string;
          description: string;
        };
      };
    };
    cta: {
      title: string;
      subtitle: string;
      button: string;
    };
  };
  languages: {
    en: string;
    ru: string;
    kz: string;
  };
  archetypes: {
    creator: string;
    leader: string;
    sage: string;
    rebel: string;
    lover: string;
    hero: string;
    magician: string;
    explorer: string;
  };
  tones: {
    calm: string;
    powerful: string;
    philosophical: string;
    triumphant: string;
  };
  common: {
    loading: string;
    error: string;
    success: string;
  };
};

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    nav: {
      home: "Home",
      howItWorks: "How It Works",
      dashboard: "Dashboard",
      pricing: "Pricing",
      getStarted: "Get Started",
      logout: "Logout",
      credits: "credits",
      themeLight: "Light theme",
      themeDark: "Dark theme",
      themeSystem: "System theme",
    },
    home: {
      badge: "Identity Programming Through Story",
      hero: {
        title: "Become Your Future Self",
        subtitle: "Transform your identity with AI-generated chapters where you've already become who you want to be.",
        notBook: "Not a book. A tool for transformation.",
      },
      cta: {
        create: "Create Your Chapter",
        howItWorks: "How It Works",
      },
      features: {
        future: {
          title: "Future-First Writing",
          description: "Your chapter is written from the perspective of your future self who has already achieved what you desire.",
        },
        psychology: {
          title: "Deep Psychology",
          description: "Grounded in identity transformation principles, not empty affirmations or mysticism.",
        },
        personalized: {
          title: "Personalized Story",
          description: "Every chapter is unique to you—your past, your fears, your vision, your archetype.",
        },
      },
      process: {
        title: "Simple. Powerful. Transformative.",
        steps: {
          share: "Share your current reality and future vision",
          choose: "Choose your archetype and narrative tone",
          receive: "Receive a 900-1100 word chapter written as your future self",
          read: "Read daily to reprogram your identity",
        },
      },
      pricing: {
        title: "Invest In Your Transformation",
        subtitle: "One powerful chapter can shift your entire identity. Start now.",
        single: "Single",
        starter: "Starter",
        committed: "Committed",
        monthly: "Monthly",
        chapter: "chapter",
        chapters: "chapters",
        perMonth: "/mo",
        startNow: "Start Creating Now",
      },
      footer: {
        tagline: "Transform your identity through story.",
        privacy: "Privacy",
        terms: "Terms",
      },
    },
    create: {
      title: "Create Your Chapter",
      subtitle: "Share your story. We'll write you into your future.",
      creditsRemaining: "You have {credits} credit(s) remaining",
      form: {
        bookTitle: "Story Title",
        bookTitlePlaceholder: "Give this story a title",
        name: "Your Name",
        namePlaceholder: "What should we call you?",
        currentLife: "Your Current Life (2-3 sentences)",
        currentLifePlaceholder: "Where are you right now? What's your daily reality?",
        pastEvents: "Key Past Events (2-3 key moments)",
        pastEventsPlaceholder: "What shaped you? What matters from your past?",
        fears: "Your Fears & Limitations (Be honest)",
        fearsPlaceholder: "What holds you back? What do you fear?",
        futureVision: "Your Future Vision (Describe in detail)",
        futureVisionPlaceholder: "Who do you want to become? What does your life look like in 3-5 years?",
        archetype: "Choose Your Archetype",
        tone: "Choose Your Tone",
      },
      generate: "Generate Chapter (1 Credit)",
      generating: "Creating Your Chapter...",
      timeEstimate: "Your chapter will be ready in 30-60 seconds",
      signInFirst: "Please sign in first",
      needCredits: "You need credits to generate a chapter",
    },
    auth: {
      signIn: {
        title: "Sign In to Continue",
        subtitle: "We'll send you a magic link to sign in. No password needed.",
        email: "Email Address",
        emailPlaceholder: "you@example.com",
        sendLink: "Send Magic Link",
        checkEmail: "Check your email!",
        clickLink: "Click the link in your email to sign in.",
      },
      verify: {
        verifying: "Verifying your link...",
        success: "Success!",
        redirecting: "Redirecting to your dashboard...",
        failed: "Verification Failed",
        expired: "Your link may have expired or is invalid.",
        tryAgain: "Try Again",
        welcomeNew: "Welcome! Let's complete your profile.",
        welcomeBack: "Welcome back!",
        goToDashboard: "Go to dashboard",
        completeProfile: "Complete profile",
      },
      complete: {
        title: "Complete Your Profile",
        subtitle: "Tell us a bit about yourself to get started.",
        fullName: "Full Name",
        namePlaceholder: "John Doe",
        language: "Preferred Language",
        complete: "Complete Registration",
        consentPrefix: "By clicking, you agree to the",
        consentOffer: "Public Offer",
        consentPrivacy: "Privacy Policy",
        consentTerms: "User Agreement",
      },
    },
    dashboard: {
      welcome: "Welcome",
      welcomeBack: "Welcome back",
      tagline: "Your transformation journey awaits.",
      loading: "Loading your dashboard...",
      books: {
        title: "Your Stories",
        noBooks: "No stories yet",
        noBooksDesc: "Create your first transformation story",
        createFirst: "Create Your First Story",
        chaptersCount: "Chapters",
        lastUpdated: "Last updated",
        continue: "Continue Story",
        startNew: "Start New Story",
      },
      stats: {
        creditsRemaining: "Credits Remaining",
        totalChapters: "Total Chapters",
        completed: "Completed",
        buyMore: "Buy More",
      },
      actions: {
        createNew: "Create New Chapter",
        getCredits: "Get Credits",
      },
      chapters: {
        title: "Your Chapters",
        noChapters: "No chapters yet",
        noChaptersDesc: "Create your first transformation story",
        createFirst: "Create Your First Chapter",
        ready: "Ready",
        generating: "Generating...",
        failed: "Failed",
        archetype: "Archetype",
        tone: "Tone",
      },
    },
    chapter: {
      title: "Chapter: {name}",
      loading: "Loading your chapter...",
      creating: "Creating Your Future...",
      creatingDesc: "Our AI is writing your transformation story.",
      timeEstimate: "This usually takes 30-60 seconds",
      failed: "Generation Failed",
      failedDesc: "Something went wrong. Your credit has been refunded.",
      tryAgain: "Try Again",
      backToDashboard: "Back to Dashboard",
      backToStory: "Back to Story",
      readDaily: "Read this daily. Let it reprogram your identity.",
      createAnother: "Create Another Chapter",
      copyText: "Copy Text",
      copied: "Copied to clipboard!",
    },
    pricing: {
      title: "Choose Your Path",
      subtitle: "Invest in your transformation. Start creating your future identity.",
      plans: {
        single: "7 Chapters",
        singleDesc: "Start your transformation story",
        starter: "20 Chapters",
        starterDesc: "Best for steady progress",
        bundle: "40 Chapters",
        bundleDesc: "For deep, long-term work",
        subscription: "Monthly Subscription",
        subscriptionDesc: "100 chapters every month",
        mostPopular: "Most Popular",
      },
      features: {
        chapters: "AI-generated chapter(s)",
        save: "Save {percent}% vs single",
        multiple: "Multiple archetypes",
        cancel: "Cancel anytime",
        consistent: "Consistent identity work",
        length: "900-1100 words",
        customize: "Choose archetype & tone",
        journey: "Full transformation journey",
      },
      purchase: "Purchase",
      signInToPurchase: "Sign In to Purchase",
      securePayment: "Secure payment powered by Freedom Pay",
      creditsNeverExpire: "Credits never expire",
      roundingNotice: "Prices are converted in real time and rounded up.",
      ratesNotice: "Exchange rates are set by the platform and may change.",
    },
    privacy: {
      title: "Privacy Policy",
      sections: {
        dataCollection: {
          title: "Data Collection",
          body: "We collect only the information necessary to provide our service: your email address, the content you provide for chapter generation, and payment information processed securely through Stripe.",
        },
        dataUsage: {
          title: "Data Usage",
          body: "Your data is used solely to generate your personalized chapters and manage your account. We use OpenAI's API to generate content, which means your input data is sent to OpenAI for processing.",
        },
        dataSecurity: {
          title: "Data Security",
          body: "We implement industry-standard security measures to protect your data. All data transmission is encrypted, and we never sell or share your personal information with third parties except as necessary to provide our service.",
        },
        rights: {
          title: "Your Rights",
          body: "You have the right to access, modify, or delete your data at any time. Contact us at support@futureself.com for any data-related requests.",
        },
        contact: {
          title: "Contact",
          body: "For questions about this policy, contact us at support@futureself.com",
        },
      },
    },
    terms: {
      title: "Terms of Service",
      sections: {
        serviceDescription: {
          title: "Service Description",
          body: "Future Self provides AI-generated narrative chapters designed to help users explore future versions of themselves through storytelling. This is a creative tool, not therapy or professional advice.",
        },
        responsibilities: {
          title: "User Responsibilities",
          body: "You are responsible for the accuracy and appropriateness of the information you provide. You agree not to use the service for any illegal or harmful purposes.",
        },
        credits: {
          title: "Credits and Payments",
          body: "Credits are used to generate chapters. Credits never expire. All payments are processed securely through Stripe. Refunds are considered on a case-by-case basis.",
        },
        ownership: {
          title: "Content Ownership",
          body: "You retain full ownership of the chapters generated for you. We reserve the right to use anonymized, aggregated data to improve our service.",
        },
        disclaimer: {
          title: "Disclaimer",
          body: "The content generated by Future Self is for creative and personal development purposes. It is not a substitute for professional advice, therapy, or counseling.",
        },
        contact: {
          title: "Contact",
          body: "For questions about these terms, contact us at support@futureself.com",
        },
      },
    },
    payment: {
      processing: "Processing payment...",
      successTitle: "Payment Successful!",
      successBody: "Your credits have been added. Ready to create your transformation story?",
      createChapter: "Create a Chapter",
      goDashboard: "Go to Dashboard",
      failedTitle: "Payment Failed",
      failedBody: "Something went wrong. Please contact support if you were charged.",
      tryAgain: "Try Again",
    },
    footer: {
      legal: "Legal",
      offer: "Public Offer",
      privacy: "Privacy Policy",
      terms: "User Agreement",
      payment: "Payment Procedure",
      delivery: "Digital Delivery Info",
      contacts: "Company Contacts",
      payments: "Payments",
      freedomPay: "Payments are processed via Freedom Pay",
    },
    howItWorks: {
      title: "How It Works",
      subtitle: "Future Self uses AI and psychology to create powerful identity transformation narratives.",
      science: {
        title: "The Science Behind It",
        p1: "Your identity is not fixed. It's a story you tell yourself, reinforced by repetition and belief.",
        p2: "Future Self leverages this principle by creating a narrative where you've already become who you want to be. When you read this story repeatedly, your brain begins to accept it as reality.",
        p3: "This isn't affirmations. This isn't visualization. This is narrative identity programming—writing yourself into existence.",
      },
      process: {
        title: "The Process",
        steps: {
          tell: {
            title: "Tell Your Story",
            description: "You provide context: your current life, key past events, fears, and your vision for the future. This grounds the narrative in reality.",
          },
          choose: {
            title: "Choose Your Archetype",
            description: "Select from 8 powerful archetypes (Creator, Leader, Sage, Rebel, etc.). This shapes the flavor of your transformation.",
          },
          tone: {
            title: "Set the Tone",
            description: "Choose how you want the chapter to feel: calm and reflective, powerful and bold, philosophical and deep, or triumphant.",
          },
          generate: {
            title: "AI Generation",
            description: "Our AI analyzes your input and crafts a 900-1100 word chapter written from your future self's perspective. First person. Present tense. Already achieved.",
          },
          receive: {
            title: "Receive Your Chapter",
            description: "Get a beautifully formatted chapter that reads like a memoir from the future. Visceral. Emotional. Transformative.",
          },
          transform: {
            title: "Read. Repeat. Transform.",
            description: "Read your chapter daily. Let it sink into your subconscious. Watch your identity shift to match the narrative.",
          },
        },
      },
      different: {
        title: "What Makes This Different",
        points: {
          notBook: {
            title: "Not a Book",
            description: "This isn't something you read once and forget. It's a tool you use daily to reprogram your identity.",
          },
          notAffirmations: {
            title: "Not Affirmations",
            description: "No shallow 'I am' statements. This is deep, narrative-driven psychology that your brain actually believes.",
          },
          notGeneric: {
            title: "Not Generic",
            description: "Every chapter is 100% personalized to your past, present, and desired future. Your story, your transformation.",
          },
          notMystical: {
            title: "Not Mystical",
            description: "Grounded in psychology, narrative identity theory, and cognitive science. Real transformation, not magical thinking.",
          },
        },
      },
      cta: {
        title: "Ready to Transform?",
        subtitle: "Create your first chapter and start living as your future self.",
        button: "Create Your Chapter Now",
      },
    },
    languages: {
      en: "English",
      ru: "Русский",
      kz: "Қазақша",
    },
    archetypes: {
      creator: "The Creator - Building something meaningful",
      leader: "The Leader - Inspiring and guiding others",
      sage: "The Sage - Wisdom and mastery",
      rebel: "The Rebel - Breaking conventions",
      lover: "The Lover - Deep connections and relationships",
      hero: "The Hero - Overcoming challenges",
      magician: "The Magician - Transformation and influence",
      explorer: "The Explorer - Freedom and discovery",
    },
    tones: {
      calm: "Calm & Reflective",
      powerful: "Powerful & Bold",
      philosophical: "Philosophical & Deep",
      triumphant: "Triumphant & Victorious",
    },
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
    },
  },
  ru: {
    nav: {
      home: "Главная",
      howItWorks: "Как это работает",
      dashboard: "Панель",
      pricing: "Тарифы",
      getStarted: "Начать",
      logout: "Выйти",
      credits: "кредитов",
      themeLight: "Светлая тема",
      themeDark: "Темная тема",
      themeSystem: "Системная тема",
    },
    home: {
      badge: "Программирование идентичности через текст",
      hero: {
        title: "Стань своим будущим",
        subtitle: "Трансформируй свою идентичность через главы, где ты уже стал тем, кем хочешь быть.",
        notBook: "Это не книга. Это инструмент трансформации.",
      },
      cta: {
        create: "Создать главу",
        howItWorks: "Как это работает",
      },
      features: {
        future: {
          title: "Письмо из будущего",
          description: "Твоя глава написана от лица будущего себя, который уже достиг желаемого.",
        },
        psychology: {
          title: "Глубокая психология",
          description: "Основано на принципах трансформации идентичности, а не пустых аффirmациях или мистике.",
        },
        personalized: {
          title: "Персональная история",
          description: "Каждая глава уникальна для тебя — твоё прошлое, страхи, видение, архетип.",
        },
      },
      process: {
        title: "Просто. Мощно. Трансформирующе.",
        steps: {
          share: "Поделись текущей реальностью и видением будущего",
          choose: "Выбери архетип и тон повествования",
          receive: "Получи главу 900-1100 слов от лица будущего себя",
          read: "Читай ежедневно для перепрограммирования идентичности",
        },
      },
      pricing: {
        title: "Инвестируй в трансформацию",
        subtitle: "Одна мощная глава может изменить всю твою идентичность. Начни сейчас.",
        single: "Одна",
        starter: "Старт",
        committed: "Серьёзно",
        monthly: "Месячная",
        chapter: "глава",
        chapters: "главы",
        perMonth: "/мес",
        startNow: "Начать создавать",
      },
      footer: {
        tagline: "Трансформируй идентичность через текст.",
        privacy: "Конфиденциальность",
        terms: "Условия",
      },
    },
    create: {
      title: "Создать главу",
      subtitle: "Расскажи свою историю. Мы напишем тебя в будущее.",
      creditsRemaining: "У тебя осталось {credits} кредитов",
      form: {
        bookTitle: "Название истории",
        bookTitlePlaceholder: "Дай истории название",
        name: "Твоё имя",
        namePlaceholder: "Как к тебе обращаться?",
        currentLife: "Твоя текущая жизнь (2-3 предложения)",
        currentLifePlaceholder: "Где ты сейчас? Какая твоя повседневная реальность?",
        pastEvents: "Ключевые события прошлого (2-3 момента)",
        pastEventsPlaceholder: "Что сформировало тебя? Что важно из прошлого?",
        fears: "Твои страхи и ограничения (Будь честен)",
        fearsPlaceholder: "Что тебя сдерживает? Чего ты боишься?",
        futureVision: "Твоё видение будущего (Опиши детально)",
        futureVisionPlaceholder: "Кем ты хочешь стать? Как выглядит твоя жизнь через 3-5 лет?",
        archetype: "Выбери архетип",
        tone: "Выбери тон",
      },
      generate: "Сгенерировать главу (1 кредит)",
      generating: "Создаём твою главу...",
      timeEstimate: "Твоя глава будет готова через 30-60 секунд",
      signInFirst: "Сначала войди в систему",
      needCredits: "Тебе нужны кредиты для генерации главы",
    },
    auth: {
      signIn: {
        title: "Войти, чтобы продолжить",
        subtitle: "Мы отправим тебе магическую ссылку для входа. Пароль не нужен.",
        email: "Email адрес",
        emailPlaceholder: "you@example.com",
        sendLink: "Отправить ссылку",
        checkEmail: "Проверь email!",
        clickLink: "Кликни на ссылку в письме для входа.",
      },
      verify: {
        verifying: "Проверяем ссылку...",
        success: "Успешно!",
        redirecting: "Перенаправляем в панель...",
        failed: "Ошибка верификации",
        expired: "Твоя ссылка истекла или неверна.",
        tryAgain: "Попробовать снова",
        welcomeNew: "Добро пожаловать! Давай завершим профиль.",
        welcomeBack: "С возвращением!",
        goToDashboard: "Перейти в панель",
        completeProfile: "Заполнить профиль",
      },
      complete: {
        title: "Заполни профиль",
        subtitle: "Расскажи немного о себе, чтобы начать.",
        fullName: "Полное имя",
        namePlaceholder: "Иван Иванов",
        language: "Предпочитаемый язык",
        complete: "Завершить регистрацию",
        consentPrefix: "Нажимая кнопку, вы принимаете",
        consentOffer: "Публичную оферту",
        consentPrivacy: "Политику конфиденциальности",
        consentTerms: "Пользовательское соглашение",
      },
    },
    dashboard: {
      welcome: "Добро пожаловать",
      welcomeBack: "С возвращением",
      tagline: "Твой путь трансформации ждёт.",
      loading: "Загружаем панель...",
      books: {
        title: "Твои истории",
        noBooks: "Историй пока нет",
        noBooksDesc: "Создай свою первую историю трансформации",
        createFirst: "Создать первую историю",
        chaptersCount: "Глав",
        lastUpdated: "Обновлено",
        continue: "Продолжить историю",
        startNew: "Новая история",
      },
      stats: {
        creditsRemaining: "Осталось кредитов",
        totalChapters: "Всего глав",
        completed: "Завершено",
        buyMore: "Купить ещё",
      },
      actions: {
        createNew: "Создать новую главу",
        getCredits: "Получить кредиты",
      },
      chapters: {
        title: "Твои главы",
        noChapters: "Пока нет глав",
        noChaptersDesc: "Создай свою первую историю трансформации",
        createFirst: "Создать первую главу",
        ready: "Готово",
        generating: "Генерируется...",
        failed: "Ошибка",
        archetype: "Архетип",
        tone: "Тон",
      },
    },
    chapter: {
      title: "Глава: {name}",
      loading: "Загружаем главу...",
      creating: "Создаём твоё будущее...",
      creatingDesc: "Наш ИИ пишет твою историю трансформации.",
      timeEstimate: "Обычно это занимает 30-60 секунд",
      failed: "Ошибка генерации",
      failedDesc: "Что-то пошло не так. Твой кредит возвращён.",
      tryAgain: "Попробовать снова",
      backToDashboard: "Назад в панель",
      backToStory: "К истории",
      readDaily: "Читай это ежедневно. Позволь перепрограммировать идентичность.",
      createAnother: "Создать ещё главу",
      copyText: "Копировать текст",
      copied: "Скопировано!",
    },
    pricing: {
      title: "Выбери свой путь",
      subtitle: "Инвестируй в трансформацию. Начни создавать будущую идентичность.",
      plans: {
        single: "7 глав",
        singleDesc: "Старт твоей истории трансформации",
        starter: "20 глав",
        starterDesc: "Лучший выбор для регулярного прогресса",
        bundle: "40 глав",
        bundleDesc: "Для глубокой и долгой работы",
        subscription: "Месячная подписка",
        subscriptionDesc: "100 глав каждый месяц",
        mostPopular: "Самый популярный",
      },
      features: {
        chapters: "ИИ-глав(а/ы)",
        save: "Экономия {percent}% от одной",
        multiple: "Несколько архетипов",
        cancel: "Отмена в любое время",
        consistent: "Постоянная работа с идентичностью",
        length: "900-1100 слов",
        customize: "Выбор архетипа и тона",
        journey: "Полный путь трансформации",
      },
      purchase: "Купить",
      signInToPurchase: "Войти для покупки",
      securePayment: "Безопасная оплата через Freedom Pay",
      creditsNeverExpire: "Кредиты никогда не истекают",
      roundingNotice: "Цены конвертируются в реальном времени и округляются вверх.",
      ratesNotice: "Курсы валют задаются платформой и могут меняться.",
    },
    privacy: {
      title: "Политика конфиденциальности",
      sections: {
        dataCollection: {
          title: "Сбор данных",
          body: "Мы собираем только информацию, необходимую для предоставления сервиса: ваш email, контент для генерации главы и платежные данные, безопасно обрабатываемые через Stripe.",
        },
        dataUsage: {
          title: "Использование данных",
          body: "Ваши данные используются исключительно для генерации персонализированных глав и управления аккаунтом. Мы используем API OpenAI для генерации контента, поэтому ваши входные данные отправляются в OpenAI для обработки.",
        },
        dataSecurity: {
          title: "Безопасность данных",
          body: "Мы применяем отраслевые меры безопасности для защиты ваших данных. Вся передача данных зашифрована, и мы никогда не продаём и не передаём вашу личную информацию третьим лицам, кроме случаев, необходимых для предоставления сервиса.",
        },
        rights: {
          title: "Ваши права",
          body: "Вы можете получить доступ, изменить или удалить свои данные в любое время. Пишите на support@futureself.com по любым вопросам, связанным с данными.",
        },
        contact: {
          title: "Контакты",
          body: "По вопросам этой политики пишите на support@futureself.com",
        },
      },
    },
    terms: {
      title: "Условия использования",
      sections: {
        serviceDescription: {
          title: "Описание сервиса",
          body: "Future Self предоставляет AI-сгенерированные главы, которые помогают исследовать будущие версии себя через сторителлинг. Это творческий инструмент, не терапия и не профессиональная консультация.",
        },
        responsibilities: {
          title: "Ответственность пользователя",
          body: "Вы несёте ответственность за точность и уместность предоставляемой информации. Вы соглашаетесь не использовать сервис для незаконных или вредных целей.",
        },
        credits: {
          title: "Кредиты и платежи",
          body: "Кредиты используются для генерации глав. Кредиты не имеют срока давности. Все платежи безопасно обрабатываются через Stripe. Возвраты рассматриваются индивидуально.",
        },
        ownership: {
          title: "Права на контент",
          body: "Вы сохраняете полное право собственности на сгенерированные главы. Мы оставляем за собой право использовать обезличенные агрегированные данные для улучшения сервиса.",
        },
        disclaimer: {
          title: "Отказ от ответственности",
          body: "Контент Future Self предназначен для творческих и личностных целей. Он не заменяет профессиональные советы, терапию или консультацию.",
        },
        contact: {
          title: "Контакты",
          body: "По вопросам условий пишите на support@futureself.com",
        },
      },
    },
    payment: {
      processing: "Обрабатываем платёж...",
      successTitle: "Платёж успешно завершён!",
      successBody: "Кредиты добавлены. Готов создать историю трансформации?",
      createChapter: "Создать главу",
      goDashboard: "Перейти в панель",
      failedTitle: "Платёж не прошёл",
      failedBody: "Что-то пошло не так. Свяжись с поддержкой, если списание произошло.",
      tryAgain: "Попробовать снова",
    },
    footer: {
      legal: "Юридическая информация",
      offer: "Публичная оферта",
      privacy: "Политика конфиденциальности",
      terms: "Пользовательское соглашение",
      payment: "Описание порядка оплаты",
      delivery: "Способы получения цифрового товара",
      contacts: "Контактные данные",
      payments: "Платёжные системы",
      freedomPay: "Платежи обрабатываются через Freedom Pay",
    },
    howItWorks: {
      title: "Как это работает",
      subtitle: "Future Self использует ИИ и психологию для создания мощных нарративов трансформации идентичности.",
      science: {
        title: "Научная основа",
        p1: "Твоя идентичность не фиксирована. Это история, которую ты рассказываешь себе, подкреплённая повторением и верой.",
        p2: "Future Self использует этот принцип, создавая нарратив, где ты уже стал тем, кем хочешь быть. Когда ты читаешь эту историю многократно, твой мозг начинает принимать её как реальность.",
        p3: "Это не аффирмация. Это не визуализация. Это программирование идентичности через нарратив — ты пишешь себя в существование.",
      },
      process: {
        title: "Процесс",
        steps: {
          tell: {
            title: "Расскажи свою историю",
            description: "Ты предоставляешь контекст: текущую жизнь, ключевые события прошлого, страхи и видение будущего. Это заземляет нарратив в реальности.",
          },
          choose: {
            title: "Выбери архетип",
            description: "Выбери из 8 мощных архетипов (Создатель, Лидер, Мудрец, Бунтарь и др.). Это формирует окрас твоей трансформации.",
          },
          tone: {
            title: "Установи тон",
            description: "Выбери, как должна звучать глава: спокойно и задумчиво, мощно и смело, философски и глубоко, или триумфально.",
          },
          generate: {
            title: "ИИ-генерация",
            description: "Наш ИИ анализирует твой ввод и создаёт главу 900-1100 слов от лица будущего себя. От первого лица. Настоящее время. Уже достигнуто.",
          },
          receive: {
            title: "Получи главу",
            description: "Получи красиво оформленную главу, которая читается как мемуары из будущего. Живо. Эмоционально. Трансформирующе.",
          },
          transform: {
            title: "Читай. Повторяй. Трансформируйся.",
            description: "Читай главу ежедневно. Позволь ей проникнуть в подсознание. Наблюдай, как идентичность меняется под нарратив.",
          },
        },
      },
      different: {
        title: "Чем это отличается",
        points: {
          notBook: {
            title: "Не книга",
            description: "Это не то, что читаешь раз и забываешь. Это инструмент для ежедневного перепрограммирования идентичности.",
          },
          notAffirmations: {
            title: "Не аффирмация",
            description: "Никаких поверхностных 'я есть' утверждений. Это глубокая психология, управляемая нарративом, в которую мозг действительно верит.",
          },
          notGeneric: {
            title: "Не общее",
            description: "Каждая глава 100% персонализирована под твоё прошлое, настоящее и желаемое будущее. Твоя история, твоя трансформация.",
          },
          notMystical: {
            title: "Не мистика",
            description: "Основано на психологии, теории нарративной идентичности и когнитивной науке. Реальная трансформация, а не магическое мышление.",
          },
        },
      },
      cta: {
        title: "Готов трансформироваться?",
        subtitle: "Создай первую главу и начни жить как будущий себя.",
        button: "Создать главу сейчас",
      },
    },
    languages: {
      en: "English",
      ru: "Русский",
      kz: "Қазақша",
    },
    archetypes: {
      creator: "Создатель - Построение чего-то значимого",
      leader: "Лидер - Вдохновлять и направлять других",
      sage: "Мудрец - Мудрость и мастерство",
      rebel: "Бунтарь - Ломать условности",
      lover: "Любящий - Глубокие связи и отношения",
      hero: "Герой - Преодолевать вызовы",
      magician: "Маг - Трансформация и влияние",
      explorer: "Исследователь - Свобода и открытия",
    },
    tones: {
      calm: "Спокойный и задумчивый",
      powerful: "Мощный и смелый",
      philosophical: "Философский и глубокий",
      triumphant: "Триумфальный и победный",
    },
    common: {
      loading: "Загрузка...",
      error: "Ошибка",
      success: "Успешно",
    },
  },
  kz: {
    nav: {
      home: "Басты бет",
      howItWorks: "Қалай жұмыс істейді",
      dashboard: "Панель",
      pricing: "Бағалар",
      getStarted: "Бастау",
      logout: "Шығу",
      credits: "кредиттер",
      themeLight: "Жарық тақырып",
      themeDark: "Қараңғы тақырып",
      themeSystem: "Жүйелік тақырып",
    },
    home: {
      badge: "Мәтін арқылы идентификацияны бағдарламалау",
      hero: {
        title: "Болашақ өзіңе айнал",
        subtitle: "AI-мен жасалған тараулар арқылы өз идентификацияңды өзгерт, онда сен болғың келген адамға айналғансың.",
        notBook: "Бұл кітап емес. Бұл өзгеріс құралы.",
      },
      cta: {
        create: "Тарауды жасау",
        howItWorks: "Қалай жұмыс істейді",
      },
      features: {
        future: {
          title: "Болашақтан жазу",
          description: "Сенің тарауың болашақ өзіңнің көзқарасынан жазылған, ол қалаған нәрсеге қол жеткізген.",
        },
        psychology: {
          title: "Терең психология",
          description: "Идентификация өзгерісінің принциптеріне негізделген, бос аффирмациялар немесе мистика емес.",
        },
        personalized: {
          title: "Жеке тарих",
          description: "Әр тарау сенің үшін бірегей — өткеніің, қорқыныштарың, көрініс, архетип.",
        },
      },
      process: {
        title: "Қарапайым. Күшті. Өзгертуші.",
        steps: {
          share: "Ағымдағы шындық пен болашақ көрінісімен бөліс",
          choose: "Архетип пен баяндау тонын таңда",
          receive: "Болашақ өзіңнен жазылған 900-1100 сөзден тұратын тарауды ал",
          read: "Идентификацияны қайта бағдарламалау үшін күнде оқы",
        },
      },
      pricing: {
        title: "Өзгерісіңе инвестиция сал",
        subtitle: "Бір күшті тарау бүкіл идентификацияңды өзгерте алады. Қазір бастау.",
        single: "Жалғыз",
        starter: "Бастама",
        committed: "Байсалды",
        monthly: "Айлық",
        chapter: "тарау",
        chapters: "тараулар",
        perMonth: "/ай",
        startNow: "Қазір бастау",
      },
      footer: {
        tagline: "Мәтін арқылы идентификацияны өзгерт.",
        privacy: "Құпиялық",
        terms: "Шарттар",
      },
    },
    create: {
      title: "Тарауды жасау",
      subtitle: "Өз тарихыңды айт. Біз сені болашаққа жазамыз.",
      creditsRemaining: "Сенде {credits} кредит қалды",
      form: {
        bookTitle: "Оқиға атауы",
        bookTitlePlaceholder: "Оқиғаға атау бер",
        name: "Сенің атың",
        namePlaceholder: "Сені қалай атауға болады?",
        currentLife: "Қазіргі өміріің (2-3 сөйлем)",
        currentLifePlaceholder: "Қазір қайдасың? Күнделікті шындығың қандай?",
        pastEvents: "Өткеннің негізгі оқиғалары (2-3 сәт)",
        pastEventsPlaceholder: "Сені не қалыптастырды? Өткеннен не маңызды?",
        fears: "Қорқыныштарың мен шектеулерің (Шынайы бол)",
        fearsPlaceholder: "Сені не ұстайды? Неден қорқасың?",
        futureVision: "Болашаққа көзқарасың (Толық сипатта)",
        futureVisionPlaceholder: "Кім болғың келеді? 3-5 жылдан кейінгі өмірің қандай болады?",
        archetype: "Архетипті таңда",
        tone: "Тонды таңда",
      },
      generate: "Тарауды жасау (1 кредит)",
      generating: "Тарауыңды жасаймыз...",
      timeEstimate: "Тарауың 30-60 секундта дайын болады",
      signInFirst: "Алдымен жүйеге кір",
      needCredits: "Тарауды жасау үшін кредиттер қажет",
    },
    auth: {
      signIn: {
        title: "Жалғастыру үшін кіру",
        subtitle: "Біз саған кіру үшін сиқырлы сілтеме жібереміз. Құпия сөз қажет емес.",
        email: "Email мекенжайы",
        emailPlaceholder: "you@example.com",
        sendLink: "Сілтеме жіберу",
        checkEmail: "Email тексер!",
        clickLink: "Кіру үшін хатыңдағы сілтемені бас.",
      },
      verify: {
        verifying: "Сілтемені тексеріп жатырмыз...",
        success: "Сәтті!",
        redirecting: "Панельге бағыттаймыз...",
        failed: "Тексеру қатесі",
        expired: "Сілтемең мерзімі өткен немесе жарамсыз.",
        tryAgain: "Қайта көру",
        welcomeNew: "Қош келдің! Профильді аяқтайық.",
        welcomeBack: "Қайта қош келдің!",
        goToDashboard: "Панельге өту",
        completeProfile: "Профильді толтыру",
      },
      complete: {
        title: "Профильді толтыр",
        subtitle: "Бастау үшін өзің туралы аздап айт.",
        fullName: "Толық аты",
        namePlaceholder: "Иван Иванов",
        language: "Қалаулы тіл",
        complete: "Тіркелуді аяқтау",
        consentPrefix: "Батырманы басу арқылы сіз",
        consentOffer: "Жария офертаны",
        consentPrivacy: "Құпиялық саясатын",
        consentTerms: "Пайдаланушы келісімін",
      },
    },
    dashboard: {
      welcome: "Қош келдің",
      welcomeBack: "Қайтып келуімен",
      tagline: "Сенің өзгеру жолың күтіп тұр.",
      loading: "Панельді жүктеп жатырмыз...",
      books: {
        title: "Әңгімелерің",
        noBooks: "Әзірге әңгіме жоқ",
        noBooksDesc: "Алғашқы өзгеру тарихыңды жаса",
        createFirst: "Бірінші әңгіме жасау",
        chaptersCount: "Тарау саны",
        lastUpdated: "Соңғы жаңарту",
        continue: "Әңгімені жалғастыру",
        startNew: "Жаңа әңгіме",
      },
      stats: {
        creditsRemaining: "Қалған кредиттер",
        totalChapters: "Барлық тараулар",
        completed: "Аяқталды",
        buyMore: "Тағы сатып алу",
      },
      actions: {
        createNew: "Жаңа тарауды жасау",
        getCredits: "Кредиттерді алу",
      },
      chapters: {
        title: "Сенің тараулар",
        noChapters: "Әлі тараулар жоқ",
        noChaptersDesc: "Алғашқы өзгеру тарихыңды жаса",
        createFirst: "Бірінші тарауды жасау",
        ready: "Дайын",
        generating: "Генерациялануда...",
        failed: "Қате",
        archetype: "Архетип",
        tone: "Тон",
      },
    },
    chapter: {
      title: "Тарау: {name}",
      loading: "Тарауыңды жүктеп жатырмыз...",
      creating: "Болашағыңды жасаймыз...",
      creatingDesc: "AI өзгеру тарихыңды жазып жатыр.",
      timeEstimate: "Бұл әдетте 30-60 секунд алады",
      failed: "Генерация қатесі",
      failedDesc: "Бірдеңе дұрыс болмады. Кредитің қайтарылды.",
      tryAgain: "Қайта көру",
      backToDashboard: "Панельге оралу",
      backToStory: "Әңгімеге оралу",
      readDaily: "Мұны күнде оқы. Идентификацияны қайта бағдарламалауға рұқсат бер.",
      createAnother: "Тағы бір тарау жасау",
      copyText: "Мәтінді көшіру",
      copied: "Көшірілді!",
    },
    pricing: {
      title: "Жолыңды таңда",
      subtitle: "Өзгерісіңе инвестиция сал. Болашақ идентификацияңды жасауды бастау.",
      plans: {
        single: "7 тарау",
        singleDesc: "Өзгеру тарихын бастау",
        starter: "20 тарау",
        starterDesc: "Тұрақты прогресс үшін ең жақсы",
        bundle: "40 тарау",
        bundleDesc: "Терең және ұзақ жұмыс үшін",
        subscription: "Айлық жазылым",
        subscriptionDesc: "Ай сайын 100 тарау",
        mostPopular: "Ең танымал",
      },
      features: {
        chapters: "AI-тарау(лар)",
        save: "{percent}% үнемдеу",
        multiple: "Бірнеше архетип",
        cancel: "Кез келген уақытта болдырмау",
        consistent: "Үздіксіз идентификация жұмысы",
        length: "900-1100 сөз",
        customize: "Архетип пен тонды таңдау",
        journey: "Толық өзгеріс жолы",
      },
      purchase: "Сатып алу",
      signInToPurchase: "Сатып алу үшін кіру",
      securePayment: "Freedom Pay арқылы қауіпсіз төлем",
      creditsNeverExpire: "Кредиттер ешқашан мерзімі өтпейді",
      roundingNotice: "Бағалар нақты уақытта конвертацияланып, жоғарыға дөңгелектеледі.",
      ratesNotice: "Валюта бағамдары платформа арқылы орнатылады және өзгеруі мүмкін.",
    },
    privacy: {
      title: "Құпиялық саясаты",
      sections: {
        dataCollection: {
          title: "Деректерді жинау",
          body: "Біз қызмет көрсету үшін қажет ақпаратты ғана жинаймыз: email, тарау генерациясына берілген контент және Stripe арқылы қауіпсіз өңделетін төлем деректері.",
        },
        dataUsage: {
          title: "Деректерді пайдалану",
          body: "Деректеріңіз тек жеке тарауларды жасау және аккаунтты басқару үшін қолданылады. Контентті генерациялау үшін OpenAI API қолданылады, сондықтан енгізілген деректер OpenAI-ға өңдеу үшін жіберіледі.",
        },
        dataSecurity: {
          title: "Деректер қауіпсіздігі",
          body: "Біз деректерді қорғау үшін салалық стандарттағы қауіпсіздік шараларын қолданамыз. Барлық деректер беру шифрланады, және біз жеке ақпаратты қызмет көрсету үшін қажет жағдайларды қоспағанда, үшінші тараптарға сатпаймыз да бермейміз.",
        },
        rights: {
          title: "Құқықтарың",
          body: "Кез келген уақытта деректеріңе қол жеткізуге, өзгертуге немесе жоюға құқығың бар. Деректерге қатысты сұрақтар үшін support@futureself.com мекенжайына хабарлас.",
        },
        contact: {
          title: "Байланыс",
          body: "Осы саясат бойынша сұрақтар болса, support@futureself.com мекенжайына жаз.",
        },
      },
    },
    terms: {
      title: "Қызмет көрсету шарттары",
      sections: {
        serviceDescription: {
          title: "Қызмет сипаттамасы",
          body: "Future Self — сторителлинг арқылы болашақ өзіңді зерттеуге көмектесетін AI-генерацияланған тараулар. Бұл шығармашылық құрал, терапия немесе кәсіби кеңес емес.",
        },
        responsibilities: {
          title: "Пайдаланушы жауапкершілігі",
          body: "Берілген ақпараттың дұрыстығы мен орындылығына сен жауаптысың. Қызметті заңсыз немесе зиянды мақсаттарда қолданбауға келісесің.",
        },
        credits: {
          title: "Кредиттер және төлемдер",
          body: "Кредиттер тарауларды жасау үшін қолданылады. Кредиттердің мерзімі аяқталмайды. Барлық төлемдер Stripe арқылы қауіпсіз өңделеді. Қайтарымдар жеке қарастырылады.",
        },
        ownership: {
          title: "Контентке меншік құқығы",
          body: "Сен жасалған тараулардың толық иесісің. Біз қызметті жақсарту үшін жеке деректерсіз агрегатталған мәліметтерді қолдану құқығын сақтаймыз.",
        },
        disclaimer: {
          title: "Жауапкершіліктен бас тарту",
          body: "Future Self контенті шығармашылық және тұлғалық даму мақсатында беріледі. Ол кәсіби кеңес, терапия немесе консультацияның орнын алмастырмайды.",
        },
        contact: {
          title: "Байланыс",
          body: "Шарттар туралы сұрақтар бойынша support@futureself.com мекенжайына жазыңыз",
        },
      },
    },
    payment: {
      processing: "Төлем өңделуде...",
      successTitle: "Төлем сәтті өтті!",
      successBody: "Кредиттер қосылды. Өзгеру тарихын жасауға дайынсың ба?",
      createChapter: "Тарау жасау",
      goDashboard: "Панельге өту",
      failedTitle: "Төлем өтпеді",
      failedBody: "Бірдеңе дұрыс болмады. Егер төлем алынса, қолдауға хабарлас.",
      tryAgain: "Қайта көру",
    },
    footer: {
      legal: "Құқықтық ақпарат",
      offer: "Жария оферта",
      privacy: "Құпиялық саясаты",
      terms: "Пайдаланушы келісімі",
      payment: "Төлем тәртібі",
      delivery: "Цифрлық өнімді алу жолдары",
      contacts: "Компания байланыстары",
      payments: "Төлем жүйелері",
      freedomPay: "Төлемдер Freedom Pay арқылы өңделеді",
    },
    howItWorks: {
      title: "Қалай жұмыс істейді",
      subtitle: "Future Self идентификация өзгерісінің күшті баяндамаларын жасау үшін AI мен психологияны қолданады.",
      science: {
        title: "Ғылыми негіз",
        p1: "Сенің идентификацияң бекітілген емес. Бұл өзіңе айтатын тарих, қайталау мен сенім арқылы нығайтылған.",
        p2: "Future Self осы принципті пайдаланып, сен болғың келген адамға айналған баяндаманы жасайды. Осы тарихты қайталап оқыған кезде, миың оны шындық ретінде қабылдай бастайды.",
        p3: "Бұл аффирмациялар емес. Бұл визуализация емес. Бұл баяндама арқылы идентификацияны бағдарламалау — өзіңді болмысқа жазу.",
      },
      process: {
        title: "Процесс",
        steps: {
          tell: {
            title: "Тарихыңды айт",
            description: "Контекстті береді: қазіргі өмір, өткеннің негізгі оқиғалары, қорқыныштар және болашаққа көзқарас. Бұл баяндаманы шындыққа негіздейді.",
          },
          choose: {
            title: "Архетипті таңда",
            description: "8 күшті архетиптен таңда (Жасаушы, Көшбасшы, Дана, Бүлікші және т.б.). Бұл өзгерісіңнің түсін қалыптастырады.",
          },
          tone: {
            title: "Тонды орнат",
            description: "Тарау қалай естілуі керектігін таңда: тыныш және ойлы, күшті және батыл, философиялық және терең немесе жеңіспен.",
          },
          generate: {
            title: "AI генерациясы",
            description: "Біздің AI енгізуіңді талдап, болашақ өзіңнің көзқарасынан 900-1100 сөзден тұратын тарауды жасайды. Бірінші жақтан. Осы шақта. Қол жеткізілді.",
          },
          receive: {
            title: "Тарауды ал",
            description: "Болашақтан естеліктер сияқты оқылатын әдемі пішімделген тарауды ал. Тірі. Эмоционалды. Өзгертуші.",
          },
          transform: {
            title: "Оқы. Қайтала. Өзгер.",
            description: "Тарауды күнде оқы. Оны санаға сіңуіне рұқсат бер. Идентификацияның баяндамаға сай өзгерісін қара.",
          },
        },
      },
      different: {
        title: "Не айырмашылық",
        points: {
          notBook: {
            title: "Кітап емес",
            description: "Бұл бір рет оқып, ұмытатын нәрсе емес. Бұл идентификацияны күнде қайта бағдарламалау үшін құрал.",
          },
          notAffirmations: {
            title: "Аффирмациялар емес",
            description: "Таяз 'мен' деген мәлімдемелер жоқ. Бұл миың шынымен сенетін баяндама басқаратын терең психология.",
          },
          notGeneric: {
            title: "Жалпы емес",
            description: "Әр тарау өткеніңе, қазіргіңе және қалаған болашағыңа 100% жекеленген. Сенің тарихың, сенің өзгерісің.",
          },
          notMystical: {
            title: "Мистикалық емес",
            description: "Психологияға, баяндама идентификация теориясына және когнитивтік ғылымға негізделген. Нақты өзгеріс, сиқырлы ойлау емес.",
          },
        },
      },
      cta: {
        title: "Өзгеруге дайынсың ба?",
        subtitle: "Алғашқы тарауыңды жаса және болашақ өзің ретінде өмір сүруді бастау.",
        button: "Тарауды қазір жасау",
      },
    },
    languages: {
      en: "English",
      ru: "Русский",
      kz: "Қазақша",
    },
    archetypes: {
      creator: "Жасаушы - Маңызды нәрсені құру",
      leader: "Көшбасшы - Басқаларды шабыттандыру және бағыттау",
      sage: "Дана - Даналық пен шеберлік",
      rebel: "Бүлікші - Конвенцияларды бұзу",
      lover: "Сүйетін - Терең байланыстар мен қатынастар",
      hero: "Қаһарман - Қиындықтарды жеңу",
      magician: "Сиқыршы - Өзгеру және әсер ету",
      explorer: "Зерттеуші - Еркіндік және жаңалықтар",
    },
    tones: {
      calm: "Тыныш және ойлы",
      powerful: "Күшті және батыл",
      philosophical: "Философиялық және терең",
      triumphant: "Жеңіспен және жеңімпаз",
    },
    common: {
      loading: "Жүктелуде...",
      error: "Қате",
      success: "Сәтті",
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] || dictionaries[defaultLocale];
}
