// CONFIGURACIÓN DE FIREBASE 
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBQ-KTBNmCgR2JGUf9GsHRY9X_e3ur4iQ",
  authDomain: "juego-dilemas.firebaseapp.com",
  projectId: "juego-dilemas",
  storageBucket: "juego-dilemas.appspot.com",
  messagingSenderId: "783933135482",
  appId: "1:783933135482:web:e3cc1127ee36f1880479c3",
  measurementId: "G-RHBGL9J85Z"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CATEGORY_COLORS = {
  absurd: { bg: '#fef08a', text: '#451a03', border: '#fde047' },
  ethics: { bg: '#bfdbfe', text: '#172554', border: '#93c5fd' },
  tech: { bg: '#a7f3d0', text: '#022c22', border: '#6ee7b7' },
  relationships: { bg: '#fbcfe8', text: '#500724', border: '#f472b6' },
  spicy: { bg: '#dc2626', text: '#ffffff', border: '#b91c1c' },
  gaming: { bg: '#7c3aed', text: '#ffffff', border: '#6d28d9' },
  work: { bg: '#fed7aa', text: '#431407', border: '#fdba74' },
  superpowers: { bg: '#fef08a', text: '#451a03', border: '#fde047' },
  pop: { bg: '#db2777', text: '#ffffff', border: '#be185d' },
  philosophy: { bg: '#c4b5fd', text: '#2e1065', border: '#a78bfa' },
  survival: { bg: '#ea580c', text: '#ffffff', border: '#c2410c' },
  lifestyle: { bg: '#4ade80', text: '#052e16', border: '#22c55e' },
  custom: { bg: '#06b6d4', text: '#ffffff', border: '#0891b2' }
};

const TRANSLATIONS = {
  es: {
    btn_friends: "👥 Amigos",
    btn_history: "📜 Partidas",
    btn_settings: "⚙️ Ajustes",
    btn_propose: "💡 Proponer",
    btn_roulette: "🎲 Modo Ruleta (¡Sorpresa!)",
    btn_custom_decks: "🗂️ Mis Mazos",
    mystery_category: "🎲 Categoría Misteriosa (¡Secreta!)",
    btn_achievements: "🏆 Logros",
    achievements_title: "🏆 Logros y Estadísticas",
    achievements_subtitle: "Tus progresos y medallas en DebateParty",
    achievements_heading: "Medallas Desbloqueables (50 en total)",
    stat_debates: "Debates Jugados",
    stat_proposals: "Propuestas Enviadas",
    unlocked: "¡Desbloqueado! 🎉",
    locked: "Bloqueado 🔒",
    ach_unlocked_title: "¡Logro Desbloqueado!",
    custom_decks_title: "🗂️ Creador de Mazos",
    custom_decks_subtitle: "Crea y juega tus propias listas de preguntas",
    deck_name_label: "Nombre del Mazo",
    deck_name_placeholder: "Ej: Cena con amigos...",
    deck_questions_label: "Preguntas (Una por línea)",
    deck_questions_placeholder: "Escribe o añade preguntas del banco...",
    btn_browse_bank: "📚 Añadir del Banco de Preguntas",
    picker_title: "📚 Banco de Preguntas",
    picker_all_cats: "🌟 Todas las categorías",
    picker_search_placeholder: "Buscar pregunta...",
    picker_add: "Añadir ➕",
    btn_save_deck: "Guardar Mazo 💾",
    your_custom_decks: "Tus Mazos Guardados",
    no_custom_decks: "No tienes mazos personalizados todavía.",
    btn_play_deck: "¡Jugar! 🚀",
    btn_delete_deck: "Borrar 🗑️",
    proposal_title: "💡 Proponer Pregunta",
    proposal_desc: "Elige categoría y escribe tu dilema para la comunidad.",
    proposal_label_cat: "Categoría",
    proposal_label_text: "Tu Pregunta / Dilema",
    proposal_placeholder: "Ej: ¿Preferirías...",
    proposal_btn_send: "Enviar a Revisión 🚀",
    proposal_alert_empty: "Por favor, escribe una pregunta.",
    proposal_alert_success: "🎉 ¡Pregunta enviada a revisión con éxito!",
    proposal_alert_error: "Hubo un error al enviar la propuesta.",
    prop_absurd: "🤪 Dilemas Absurdos",
    prop_ethics: "⚖️ Morales y Ética",
    prop_tech: "🤖 Futuro e IA",
    prop_relationships: "❤️ Relaciones y Pareja",
    prop_spicy: "🔥 Picantes y Tabú (+18)",
    prop_gaming: "🎮 Gamer & Geek",
    prop_work: "💼 Laboral y Dinero",
    prop_superpowers: "⚡ Superpoderes y Fantasía",
    prop_pop: "🍿 Cine y Series",
    prop_philosophy: "🧠 Filosofía Barata",
    prop_survival: "🚨 Situaciones Límite",
    prop_lifestyle: "🍔 Estilo de Vida",
    sort_newest: "Nuevos",
    sort_popular: "Populares",
    sort_oldest: "Antiguos",
    btn_option_a: "🅰️ Opción A",
    btn_option_b: "🅱️ Opción B",
    btn_share_dilemma: "📤 Compartir Dilema",
    btn_share: "📤 Compartir",
    hero_badge: "¡Más de <b>1.200 preguntas</b> para debatir!",
    title_step1: "¡Elige temática y a debatir!",
    subtitle_step1: "Toca una categoría para empezar la fiesta",
    topic_absurd_title: "Dilemas Absurdos",
    topic_absurd_desc: "Situaciones disparatadas para reír",
    topic_ethics_title: "Morales y Ética",
    topic_ethics_desc: "Dilemas de justicia y decisiones difíciles",
    topic_tech_title: "Futuro e IA",
    topic_tech_desc: "Tecnología, ciencia y transhumanismo",
    topic_relationships_title: "Relaciones y Pareja",
    topic_relationships_desc: "Amor, celos y dinámicas sociales",
    topic_spicy_title: "Picantes y Tabú (+18)",
    topic_spicy_desc: "Confesiones, dinero y temas picantes",
    topic_gaming_title: "Gamer & Geek",
    topic_gaming_desc: "Videojuegos, anime y cultura friki",
    topic_work_title: "Laboral y Dinero",
    topic_work_desc: "Trabajo, sueldos y emprendimiento",
    topic_superpowers_title: "Superpoderes y Fantasía",
    topic_superpowers_desc: "Habilidades mágicas con truco",
    topic_pop_title: "Cine y Series",
    topic_pop_desc: "Películas, cultura pop y finales controversiales",
    topic_philosophy_title: "Filosofía Barata",
    topic_philosophy_desc: "Preguntas existenciales de medianoche",
    topic_survival_title: "Situaciones Límite",
    topic_survival_desc: "Apocalipsis, supervivencia y emergencias",
    topic_lifestyle_title: "Estilo de Vida",
    topic_lifestyle_desc: "Comida, viajes, manías y convivencia",
    title_step2: "Ajusta tu Partida",
    label_duration: "Duración del Debate",
    dial_no_limit: "Sin Límite",
    btn_no_limit: "♾️ Sin Límite",
    range_hint: "Desliza para ajustar (máx 60 min)",
    btn_start_game: "¡EMPEZAR DEBATE! 🚀",
    btn_back_topics: "⬅ Volver a Temas",
    btn_finish_game: "Concluir Partida 🏁",
    time_up_title: "¡Tiempo Agotado!",
    time_up_desc: "¿Añadís más tiempo o cerráis la mesa?",
    btn_add_1min: "+1 Minuto ⏱️",
    btn_add_5min: "+5 Minutos ⏱️",
    step4_title: "¡Debate Guardado!",
    step4_desc: "Comparte tu opinión sobre esta pregunta con la comunidad.",
    comments_title: "💬 Debate y Opiniones",
    comment_placeholder: "Añade un comentario público...",
    reply_placeholder: "Escribe una respuesta...",
    btn_comment: "Comentar",
    profile_subtitle: "Opiniones públicas y debates jugados",
    history_title: "📜 Partidas Guardadas",
    history_subtitle: "Historial completo de tus debates",
    no_history: "No hay partidas guardadas todavía. ¡Juega tu primer debate!",
    age_verify_title: "¿Eres mayor de 18 años?",
    age_verify_desc: "Esta categoría contiene temas picantes y tabú solo para adultos.",
    age_yes: "Sí, tengo 18+",
    age_no: "No, volver atrás",
    btn_reply: "Responder",
    btn_next_question: "🎲 Siguiente Debate",
    btn_main_menu: "🏠 Menú Principal",
    friends_title: "Lista de Amigos",
    friends_tag_label: "Tu Identificador:",
    label_add_friend: "➕ Añadir Amigo por Tag",
    placeholder_friend_tag: "nombre#0000",
    btn_add: "Añadir",
    label_your_friends: "Tus Amigos",
    no_friends: "Aún no tienes amigos añadidos.",
    btn_back_menu: "⬅ Volver al Menú",
    settings_title: "Ajustes del Sistema",
    settings_subtitle: "Configura tu perfil, volumen y música",
    label_username: "Tu Nombre de Usuario",
    label_volume: "Volumen General",
    label_music: "Música de Fondo",
    toggle_music_desc: "Activar música de fondo en menús",
    label_sfx: "Efectos de Sonido (SFX)",
    toggle_sfx_desc: "Activar sonidos en botones y reloj",
    btn_save_changes: "Guardar Cambios 💾",
    btn_back: "⬅ Volver",
    footer_desc: "El juego social definitivo para reuniones, cenas y noches de debate.",
    footer_community: "Comunidad",
    footer_recommended: "Recomendados"
  },
  en: {
    btn_friends: "👥 Friends",
    btn_history: "📜 History",
    btn_settings: "⚙️ Settings",
    btn_propose: "💡 Propose",
    btn_roulette: "🎲 Roulette Mode (Surprise!)",
    btn_custom_decks: "🗂️ Custom Decks",
    mystery_category: "🎲 Mystery Category (Secret!)",
    btn_achievements: "🏆 Achievements",
    achievements_title: "🏆 Achievements & Stats",
    achievements_subtitle: "Your progress and badges in DebateParty",
    achievements_heading: "Unlockable Badges (50 total)",
    stat_debates: "Debates Played",
    stat_proposals: "Proposals Sent",
    unlocked: "Unlocked! 🎉",
    locked: "Locked 🔒",
    ach_unlocked_title: "Achievement Unlocked!",
    custom_decks_title: "🗂️ Deck Creator",
    custom_decks_subtitle: "Create and play your own question lists",
    deck_name_label: "Deck Name",
    deck_name_placeholder: "Ex: Friends dinner...",
    deck_questions_label: "Questions (One per line)",
    deck_questions_placeholder: "Type or add questions from bank...",
    btn_browse_bank: "📚 Add from Question Bank",
    picker_title: "📚 Question Bank",
    picker_all_cats: "🌟 All categories",
    picker_search_placeholder: "Search question...",
    picker_add: "Add ➕",
    btn_save_deck: "Save Deck 💾",
    your_custom_decks: "Your Saved Decks",
    no_custom_decks: "No custom decks created yet.",
    btn_play_deck: "Play! 🚀",
    btn_delete_deck: "Delete 🗑️",
    proposal_title: "💡 Propose Question",
    proposal_desc: "Choose a category and write your dilemma for the community.",
    proposal_label_cat: "Category",
    proposal_label_text: "Your Question / Dilemma",
    proposal_placeholder: "Ex: Would you rather...",
    proposal_btn_send: "Submit for Review 🚀",
    proposal_alert_empty: "Please write a question.",
    proposal_alert_success: "🎉 Question submitted for review successfully!",
    proposal_alert_error: "Error submitting proposal.",
    prop_absurd: "🤪 Absurd Dilemmas",
    prop_ethics: "⚖️ Morals & Ethics",
    prop_tech: "🤖 Future & AI",
    prop_relationships: "❤️ Relationships & Dating",
    prop_spicy: "🔥 Spicy & Taboo (+18)",
    prop_gaming: "🎮 Gamer & Geek",
    prop_work: "💼 Work & Money",
    prop_superpowers: "⚡ Superpowers & Fantasy",
    prop_pop: "🍿 Movies & Series",
    prop_philosophy: "🧠 Deep Thought",
    prop_survival: "🚨 Extreme Survival",
    prop_lifestyle: "🍔 Lifestyle",
    sort_newest: "Newest",
    sort_popular: "Popular",
    sort_oldest: "Oldest",
    btn_option_a: "🅰️ Option A",
    btn_option_b: "🅱️ Option B",
    btn_share_dilemma: "📤 Share Dilemma",
    btn_share: "📤 Share",
    hero_badge: "Over <b>1,200 questions</b> to debate!",
    title_step1: "Choose a topic & debate!",
    subtitle_step1: "Tap a category to start the party",
    topic_absurd_title: "Absurd Dilemmas",
    topic_absurd_desc: "Crazy situations for a good laugh",
    topic_ethics_title: "Morals & Ethics",
    topic_ethics_desc: "Justice dilemmas & tough choices",
    topic_tech_title: "Future & AI",
    topic_tech_desc: "Technology, science & transhumanism",
    topic_relationships_title: "Relationships & Dating",
    topic_relationships_desc: "Love, jealousy & social dynamics",
    topic_spicy_title: "Spicy & Taboo (+18)",
    topic_spicy_desc: "Confessions, money & spicy topics",
    topic_gaming_title: "Gamer & Geek",
    topic_gaming_desc: "Video games, anime & geek culture",
    topic_work_title: "Work & Money",
    topic_work_desc: "Jobs, salaries & entrepreneurship",
    topic_superpowers_title: "Superpowers & Fantasy",
    topic_superpowers_desc: "Magical abilities with a twist",
    topic_pop_title: "Movies & Series",
    topic_pop_desc: "Movies, pop culture & controversial endings",
    topic_philosophy_title: "Deep Thought",
    topic_philosophy_desc: "Midnight existential questions",
    topic_survival_title: "Extreme Survival",
    topic_survival_desc: "Apocalypse, survival & emergencies",
    topic_lifestyle_title: "Lifestyle",
    topic_lifestyle_desc: "Food, travel, habits & living together",
    title_step2: "Customize Your Game",
    label_duration: "Debate Duration",
    dial_no_limit: "No Limit",
    btn_no_limit: "♾️ No Limit",
    range_hint: "Slide to adjust (max 60 min)",
    btn_start_game: "START DEBATE! 🚀",
    btn_back_topics: "⬅ Back to Topics",
    btn_finish_game: "Finish Match 🏁",
    time_up_title: "Time's Up!",
    time_up_desc: "Add more time or finish the debate?",
    btn_add_1min: "+1 Minute ⏱️",
    btn_add_5min: "+5 Minutes ⏱️",
    step4_title: "Debate Saved!",
    step4_desc: "Share your opinion on this question with the community.",
    comments_title: "💬 Debate & Opinions",
    comment_placeholder: "Add a public comment...",
    reply_placeholder: "Write a reply...",
    btn_comment: "Comment",
    profile_subtitle: "Shared public opinions & played debates",
    history_title: "📜 Saved Matches",
    history_subtitle: "Complete history of your debates",
    no_history: "No saved matches yet. Play your first debate!",
    age_verify_title: "Are you 18 or older?",
    age_verify_desc: "This category contains spicy and taboo topics for adults only.",
    age_yes: "Yes, I am 18+",
    age_no: "No, go back",
    btn_reply: "Reply",
    btn_next_question: "🎲 Next Debate",
    btn_main_menu: "🏠 Main Menu",
    friends_title: "Friends List",
    friends_tag_label: "Your Tag:",
    label_add_friend: "➕ Add Friend by Tag",
    placeholder_friend_tag: "name#0000",
    btn_add: "Add",
    label_your_friends: "Your Friends",
    no_friends: "You don't have any friends added yet.",
    btn_back_menu: "⬅ Back to Menu",
    settings_title: "System Settings",
    settings_subtitle: "Configure volume and music",
    label_volume: "Master Volume",
    label_music: "Background Music",
    toggle_music_desc: "Enable background music in menus",
    label_sfx: "Sound Effects (SFX)",
    toggle_sfx_desc: "Enable sounds for buttons & timers",
    btn_save_changes: "Save Changes 💾",
    btn_back: "⬅ Back",
    footer_desc: "The ultimate party game for hangouts, dinners & debate nights.",
    footer_community: "Community",
    footer_recommended: "Recommended"
  }
};

const ACHIEVEMENTS_DATA = [
  { id: 'deb_1', icon: '🎯', titleEs: 'Primer Debate', titleEn: 'First Debate', descEs: 'Juega tu primer debate.', descEn: 'Play your first debate.', check: s => s.debatesPlayed >= 1 },
  { id: 'deb_3', icon: '💬', titleEs: 'Tertulia Casual', titleEn: 'Casual Gathering', descEs: 'Completa 3 debates.', descEn: 'Complete 3 debates.', check: s => s.debatesPlayed >= 3 },
  { id: 'deb_5', icon: '🗣️', titleEs: 'Tertuliano', titleEn: 'Debater', descEs: 'Completa 5 debates.', descEn: 'Complete 5 debates.', check: s => s.debatesPlayed >= 5 },
  { id: 'deb_10', icon: '🔥', titleEs: 'Superviviente', titleEn: 'Survivor', descEs: 'Completa 10 debates.', descEn: 'Complete 10 debates.', check: s => s.debatesPlayed >= 10 },
  { id: 'deb_15', icon: '⚡', titleEs: 'Orador Activo', titleEn: 'Active Speaker', descEs: 'Completa 15 debates.', descEn: 'Complete 15 debates.', check: s => s.debatesPlayed >= 15 },
  { id: 'deb_20', icon: '🏅', titleEs: 'Tertuliano Experto', titleEn: 'Expert Debater', descEs: 'Completa 20 debates.', descEn: 'Complete 20 debates.', check: s => s.debatesPlayed >= 20 },
  { id: 'deb_25', icon: '⭐', titleEs: 'Maestro de la Palabra', titleEn: 'Master of Words', descEs: 'Completa 25 debates.', descEn: 'Complete 25 debates.', check: s => s.debatesPlayed >= 25 },
  { id: 'deb_35', icon: '🌟', titleEs: 'Líder de Opinión', titleEn: 'Opinion Leader', descEs: 'Completa 35 debates.', descEn: 'Complete 35 debates.', check: s => s.debatesPlayed >= 35 },
  { id: 'deb_50', icon: '👑', titleEs: 'Leyenda del Banquillo', titleEn: 'Bench Legend', descEs: 'Completa 50 debates.', descEn: 'Complete 50 debates.', check: s => s.debatesPlayed >= 50 },
  { id: 'deb_100', icon: '🏆', titleEs: 'Dios del Ágora', titleEn: 'Agora God', descEs: 'Completa 100 debates.', descEn: 'Complete 100 debates.', check: s => s.debatesPlayed >= 100 },

  { id: 'cat_abs_1', icon: '🤪', titleEs: 'Dilemas de Locura', titleEn: 'Crazy Dilemmas', descEs: 'Juega en Absurdos.', descEn: 'Play in Absurd.', check: s => (s.categoryCounts?.absurd || 0) >= 1 },
  { id: 'cat_abs_5', icon: '🤡', titleEs: 'Comediante Nato', titleEn: 'Born Comedian', descEs: 'Juega 5 veces en Absurdos.', descEn: 'Play 5 times in Absurd.', check: s => (s.categoryCounts?.absurd || 0) >= 5 },
  { id: 'cat_abs_10', icon: '🎪', titleEs: 'Rey del Humor', titleEn: 'King of Comedy', descEs: 'Juega 10 veces en Absurdos.', descEn: 'Play 10 times in Absurd.', check: s => (s.categoryCounts?.absurd || 0) >= 10 },

  { id: 'cat_eth_1', icon: '⚖️', titleEs: 'Juez Supremo', titleEn: 'Supreme Judge', descEs: 'Juega en Ética.', descEn: 'Play in Ethics.', check: s => (s.categoryCounts?.ethics || 0) >= 1 },
  { id: 'cat_eth_5', icon: '🏛️', titleEs: 'Dilema Moral', titleEn: 'Moral Dilemma', descEs: 'Juega 5 veces en Ética.', descEn: 'Play 5 times in Ethics.', check: s => (s.categoryCounts?.ethics || 0) >= 5 },
  { id: 'cat_eth_10', icon: '📜', titleEs: 'Filósofo Ético', titleEn: 'Ethical Philosopher', descEs: 'Juega 10 veces en Ética.', descEn: 'Play 10 times in Ethics.', check: s => (s.categoryCounts?.ethics || 0) >= 10 },

  { id: 'cat_tec_1', icon: '🤖', titleEs: 'Visionario Digital', titleEn: 'Digital Visionary', descEs: 'Juega en Futuro e IA.', descEn: 'Play in Tech & AI.', check: s => (s.categoryCounts?.tech || 0) >= 1 },
  { id: 'cat_tec_5', icon: '⚡', titleEs: 'Cerebro Cibernético', titleEn: 'Cyber Brain', descEs: 'Juega 5 veces en Tech.', descEn: 'Play 5 times in Tech.', check: s => (s.categoryCounts?.tech || 0) >= 5 },
  { id: 'cat_tec_10', icon: '🚀', titleEs: 'Transhumanista', titleEn: 'Transhumanist', descEs: 'Juega 10 veces en Tech.', descEn: 'Play 10 times in Tech.', check: s => (s.categoryCounts?.tech || 0) >= 10 },

  { id: 'cat_rel_1', icon: '❤️', titleEs: 'Casanova', titleEn: 'Casanova', descEs: 'Juega en Relaciones.', descEn: 'Play in Relationships.', check: s => (s.categoryCounts?.relationships || 0) >= 1 },
  { id: 'cat_rel_5', icon: '💘', titleEs: 'Consejero del Amor', titleEn: 'Love Counselor', descEs: 'Juega 5 veces en Relaciones.', descEn: 'Play 5 times in Relationships.', check: s => (s.categoryCounts?.relationships || 0) >= 5 },
  { id: 'cat_rel_10', icon: '🌹', titleEs: 'Cupido del Foro', titleEn: 'Forum Cupid', descEs: 'Juega 10 veces en Relaciones.', descEn: 'Play 10 times in Relationships.', check: s => (s.categoryCounts?.relationships || 0) >= 10 },

  { id: 'cat_spi_1', icon: '🔥', titleEs: 'Fuego en la Mesa', titleEn: 'Fire on Table', descEs: 'Juega en Picantes (+18).', descEn: 'Play in Spicy (+18).', check: s => (s.categoryCounts?.spicy || 0) >= 1 },
  { id: 'cat_spi_5', icon: '🌶️', titleEs: 'Alma de la Fiesta', titleEn: 'Party Soul', descEs: 'Juega 5 veces en Picantes.', descEn: 'Play 5 times in Spicy.', check: s => (s.categoryCounts?.spicy || 0) >= 5 },
  { id: 'cat_spi_10', icon: '🔞', titleEs: 'Tabú Roto', titleEn: 'Broken Taboo', descEs: 'Juega 10 veces en Picantes.', descEn: 'Play 10 times in Spicy.', check: s => (s.categoryCounts?.spicy || 0) >= 10 },

  { id: 'cat_gam_1', icon: '🎮', titleEs: 'Gamer Pro', titleEn: 'Pro Gamer', descEs: 'Juega en Gamer & Geek.', descEn: 'Play in Gamer.', check: s => (s.categoryCounts?.gaming || 0) >= 1 },
  { id: 'cat_gam_5', icon: '🕹️', titleEs: 'Nivel Completado', titleEn: 'Level Completed', descEs: 'Juega 5 veces en Gaming.', descEn: 'Play 5 times in Gaming.', check: s => (s.categoryCounts?.gaming || 0) >= 5 },

  { id: 'cat_wrk_1', icon: '💼', titleEs: 'Gurú del Empleo', titleEn: 'Employment Guru', descEs: 'Juega en Laboral y Dinero.', descEn: 'Play in Work.', check: s => (s.categoryCounts?.work || 0) >= 1 },
  { id: 'cat_wrk_5', icon: '💰', titleEs: 'Tiburón Financiero', titleEn: 'Financial Shark', descEs: 'Juega 5 veces en Laboral.', descEn: 'Play 5 times in Work.', check: s => (s.categoryCounts?.work || 0) >= 5 },

  { id: 'cat_sup_1', icon: '🦸', titleEs: 'Héroe con Capa', titleEn: 'Caped Hero', descEs: 'Juega en Superpoderes.', descEn: 'Play in Superpowers.', check: s => (s.categoryCounts?.superpowers || 0) >= 1 },
  { id: 'cat_sup_5', icon: '✨', titleEs: 'Poder Absoluto', titleEn: 'Absolute Power', descEs: 'Juega 5 veces en Superpoderes.', descEn: 'Play 5 times in Superpowers.', check: s => (s.categoryCounts?.superpowers || 0) >= 5 },

  { id: 'cat_pop_1', icon: '🍿', titleEs: 'Cinéfilo', titleEn: 'Cinephile', descEs: 'Juega en Cine y Series.', descEn: 'Play in Movies.', check: s => (s.categoryCounts?.pop || 0) >= 1 },
  { id: 'cat_pop_5', icon: '🎬', titleEs: 'Crítico de Cine', titleEn: 'Movie Critic', descEs: 'Juega 5 veces en Cine.', descEn: 'Play 5 times in Movies.', check: s => (s.categoryCounts?.pop || 0) >= 5 },

  { id: 'cat_phi_1', icon: '🧠', titleEs: 'Filósofo nocturno', titleEn: 'Night Philosopher', descEs: 'Juega en Filosofía Barata.', descEn: 'Play in Deep Thought.', check: s => (s.categoryCounts?.philosophy || 0) >= 1 },
  { id: 'cat_phi_5', icon: '🌌', titleEs: 'Mentes Pensantes', titleEn: 'Thinking Minds', descEs: 'Juega 5 veces en Filosofía.', descEn: 'Play 5 times in Philosophy.', check: s => (s.categoryCounts?.philosophy || 0) >= 5 },

  { id: 'cat_srv_1', icon: '🚨', titleEs: 'Apocalipsis Now', titleEn: 'Apocalypse Now', descEs: 'Juega en Situaciones Límite.', descEn: 'Play in Survival.', check: s => (s.categoryCounts?.survival || 0) >= 1 },
  { id: 'cat_srv_5', icon: '🏕️', titleEs: 'Último Superviviente', titleEn: 'Last Survivor', descEs: 'Juega 5 veces en Límite.', descEn: 'Play 5 times in Survival.', check: s => (s.categoryCounts?.survival || 0) >= 5 },

  { id: 'cat_lif_1', icon: '🍔', titleEs: 'Estilo Gourmet', titleEn: 'Gourmet Style', descEs: 'Juega en Estilo de Vida.', descEn: 'Play in Lifestyle.', check: s => (s.categoryCounts?.lifestyle || 0) >= 1 },
  { id: 'cat_lif_5', icon: '🛋️', titleEs: 'Vida Social', titleEn: 'Social Life', descEs: 'Juega 5 veces en Estilo de Vida.', descEn: 'Play 5 times in Lifestyle.', check: s => (s.categoryCounts?.lifestyle || 0) >= 5 },

  { id: 'prop_1', icon: '💡', titleEs: 'Creador Novato', titleEn: 'Novice Creator', descEs: 'Envía tu primera propuesta.', descEn: 'Submit your 1st proposal.', check: s => s.proposalsCount >= 1 },
  { id: 'prop_3', icon: '✍️', titleEs: 'Arquitecto de Dilemas', titleEn: 'Dilemma Architect', descEs: 'Envía 3 propuestas.', descEn: 'Submit 3 proposals.', check: s => s.proposalsCount >= 3 },
  { id: 'prop_5', icon: '📜', titleEs: 'Genio Creativo', titleEn: 'Creative Genius', descEs: 'Envía 5 propuestas.', descEn: 'Submit 5 proposals.', check: s => s.proposalsCount >= 5 },
  { id: 'prop_10', icon: '🚀', titleEs: 'Pluma Inagotable', titleEn: 'Endless Pen', descEs: 'Envía 10 propuestas.', descEn: 'Submit 10 proposals.', check: s => s.proposalsCount >= 10 },

  { id: 'exp_3', icon: '🧭', titleEs: 'Explorador Social', titleEn: 'Social Explorer', descEs: 'Prueba 3 categorías diferentes.', descEn: 'Try 3 categories.', check: s => (s.categoriesPlayed || []).length >= 3 },
  { id: 'exp_6', icon: '🗺️', titleEs: 'Viajero Frecuente', titleEn: 'Frequent Traveler', descEs: 'Prueba 6 categorías diferentes.', descEn: 'Try 6 categories.', check: s => (s.categoriesPlayed || []).length >= 6 },
  { id: 'exp_all', icon: '🌐', titleEs: 'Omnívoro Temático', titleEn: 'Thematic Omnivore', descEs: 'Juega en las 12 categorías.', descEn: 'Play all 12 categories.', check: s => (s.categoriesPlayed || []).length >= 12 },

  { id: 'vote_1', icon: '🗳️', titleEs: 'Voz del Pueblo', titleEn: 'Voice of the People', descEs: 'Emite tu primer voto en vivo.', descEn: 'Cast your 1st live vote.', check: s => s.votesCast >= 1 },
  { id: 'vote_10', icon: '📊', titleEs: 'Elector Firme', titleEn: 'Firm Elector', descEs: 'Emite 10 votos en vivo.', descEn: 'Cast 10 live votes.', check: s => s.votesCast >= 10 },

  { id: 'roul_1', icon: '🎲', titleEs: 'Ruleta Rusa', titleEn: 'Russian Roulette', descEs: 'Usa el Modo Ruleta una vez.', descEn: 'Use Roulette Mode once.', check: s => s.rouletteCount >= 1 },
  { id: 'coll_all', icon: '🏆', titleEs: 'Completionista Total', titleEn: 'Total Completionist', descEs: 'Desbloquea 25 logros en total.', descEn: 'Unlock 25 total achievements.', check: (s, count) => count >= 25 }
];

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  if (!state.user.audioSettings.sfxEnabled) return;
  if (audioCtx.state === 'suspended') { audioCtx.resume(); }

  const masterVol = state.user.audioSettings.volume / 100;
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  const now = audioCtx.currentTime;

  if (type === 'click') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
    gainNode.gain.setValueAtTime(0.1 * masterVol, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    osc.start(now); osc.stop(now + 0.05);
  } else if (type === 'start') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.setValueAtTime(500, now + 0.1);
    osc.frequency.setValueAtTime(700, now + 0.2);
    gainNode.gain.setValueAtTime(0.15 * masterVol, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now); osc.stop(now + 0.3);
  } else if (type === 'tick') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.02);
    gainNode.gain.setValueAtTime(0.08 * masterVol, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
    osc.start(now); osc.stop(now + 0.02);
  } else if (type === 'timeup') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now);
    osc.frequency.setValueAtTime(880, now + 0.15);
    gainNode.gain.setValueAtTime(0.25 * masterVol, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc.start(now); osc.stop(now + 0.6);
  }
}

let ytPlayer = null;
const TRACK_MENU = '58XODsOaNvM';
const TRACK_DEBATE = 'eMmNmmfnK60';

window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player('yt-player', {
    height: '0', width: '0', videoId: TRACK_MENU,
    playerVars: { 'autoplay': 1, 'loop': 1, 'playlist': TRACK_MENU },
    events: { 'onReady': (event) => { setYoutubeVolume(); } }
  });
};

if (!window.YT) {
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function setYoutubeVolume() {
  if (!ytPlayer || typeof ytPlayer.setVolume !== 'function') return;
  if (state.user.audioSettings.musicEnabled) {
    ytPlayer.setVolume(state.user.audioSettings.volume);
    try { ytPlayer.playVideo(); } catch(e) {}
  } else {
    ytPlayer.pauseVideo();
  }
}

function switchMusicTrack(trackName) {
  if (!ytPlayer || typeof ytPlayer.loadVideoById !== 'function') return;
  if (!state.user.audioSettings.musicEnabled) return;
  if (trackName === 'menu') {
    ytPlayer.loadVideoById({ 'videoId': TRACK_MENU });
  } else if (trackName === 'debate') {
    ytPlayer.loadVideoById({ 'videoId': TRACK_DEBATE, 'startSeconds': 18 });
  }
  setYoutubeVolume();
}

let DATABASE = {};
let currentLang = 'es';

let savedUser = JSON.parse(localStorage.getItem('debate_party_user')) || null;
let savedStats = JSON.parse(localStorage.getItem('debate_party_stats')) || {};
let customDecks = JSON.parse(localStorage.getItem('debate_party_custom_decks')) || [];

if (typeof savedStats.debatesPlayed !== 'number') savedStats.debatesPlayed = 0;
if (typeof savedStats.proposalsCount !== 'number') savedStats.proposalsCount = 0;
if (typeof savedStats.votesCast !== 'number') savedStats.votesCast = 0;
if (typeof savedStats.rouletteCount !== 'number') savedStats.rouletteCount = 0;
if (!Array.isArray(savedStats.categoriesPlayed)) savedStats.categoriesPlayed = [];
if (!savedStats.categoryCounts) savedStats.categoryCounts = {};
if (!Array.isArray(savedStats.unlockedAchievements)) savedStats.unlockedAchievements = [];

let state = {
  currentStep: 1,
  user: {
    username: savedUser ? savedUser.username : "Jugador",
    tag: savedUser ? savedUser.tag : String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
    audioSettings: { volume: 10, sfxEnabled: true, musicEnabled: true }
  },
  stats: savedStats,
  friends: [],
  seenQuestions: new Set(),
  matchHistory: [],
  selectedCategory: 'absurd',
  timerDurationSecs: 0,
  timeLeftSecs: 0,
  timerInterval: null,
  currentQuestionText: "",
  currentQuestionIndex: null,
  unsubscribeComments: null,
  detailQuestionText: "",
  detailCategory: "",
  commentSortMode: 'newest',
  unsubscribeDetailComments: null,
  hasVotedCurrent: false,
  currentQuestionDocId: null,
  currentVoteLabels: null,
  currentVoteResults: { pctA: 50, pctB: 50, total: 0 },
  isRouletteMode: false
};

function saveUserStats() {
  localStorage.setItem('debate_party_stats', JSON.stringify(state.stats));
}

function saveCustomDecksStorage() {
  localStorage.setItem('debate_party_custom_decks', JSON.stringify(customDecks));
}

function checkAndUnlockAchievements() {
  let unlockedCount = state.stats.unlockedAchievements.length;

  ACHIEVEMENTS_DATA.forEach(ach => {
    if (!state.stats.unlockedAchievements.includes(ach.id)) {
      if (ach.check(state.stats, unlockedCount)) {
        state.stats.unlockedAchievements.push(ach.id);
        unlockedCount++;
        saveUserStats();
        const title = currentLang === 'es' ? ach.titleEs : ach.titleEn;
        showAchievementPopup(title, ach.icon);
      }
    }
  });
}

function showAchievementPopup(title, icon) {
  const popup = document.getElementById('achievement-popup');
  if (!popup) return;
  document.getElementById('ach-popup-icon').textContent = icon;
  document.getElementById('ach-popup-name').textContent = title;
  
  popup.classList.add('show');
  playSound('start');

  setTimeout(() => { popup.classList.remove('show'); }, 4000);
}

document.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang);
  updateTagDisplays();
  renderFriendsChips();
  setupQuickTimeButtons();
  setupProposalModalTheme();
  setupPickerTheme();
  renderCustomDecksUI();
  setupQuestionPickerEvents();
  
  document.querySelectorAll('button, select').forEach(el => {
    el.addEventListener('click', () => playSound('click'));
  });
});

function applyCategoryTheme(topic) {
  const appShell = document.querySelector('.app-shell');
  appShell.className = 'app-shell';
  appShell.classList.add(`theme-${topic}`);
}

async function setLanguage(lang) {
  currentLang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      el.innerHTML = TRANSLATIONS[lang][key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      el.placeholder = TRANSLATIONS[lang][key];
    }
  });

  await loadQuestionsDatabase(lang);
  updateDynamicTexts(lang);
  renderCustomDecksUI();
  setupPickerTheme();
}

document.getElementById('lang-select').addEventListener('change', (e) => {
  setLanguage(e.target.value);
});

function updateDynamicTexts(lang) {
  if (state.timerDurationSecs === 0) {
    document.getElementById('dial-text-val').textContent = TRANSLATIONS[lang].dial_no_limit;
  }
  
  if (state.isRouletteMode) {
    document.getElementById('selected-topic-pill').textContent = TRANSLATIONS[lang].mystery_category;
  } else {
    const topicKey = `topic_${state.selectedCategory}_title`;
    if (TRANSLATIONS[lang][topicKey]) {
      document.getElementById('selected-topic-pill').textContent = TRANSLATIONS[lang][topicKey];
    } else {
      const deck = customDecks.find(d => d.id === state.selectedCategory);
      if (deck) {
        document.getElementById('selected-topic-pill').textContent = `🗂️ ${deck.name}`;
      }
    }
  }

  if (state.currentStep === 3 && state.currentQuestionIndex !== null) {
    const currentList = DATABASE[state.selectedCategory] || [];
    if (currentList[state.currentQuestionIndex]) {
      state.currentQuestionText = currentList[state.currentQuestionIndex];
      document.getElementById('question-text').textContent = state.currentQuestionText;
    }
  }
}

async function loadQuestionsDatabase(lang = 'es') {
  try {
    const fileName = `preguntas_${lang}.json`;
    const response = await fetch(fileName);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    DATABASE = await response.json();
    
    customDecks.forEach(deck => {
      DATABASE[deck.id] = deck.questions;
    });
  } catch (error) {
    console.error(`❌ Error al cargar ${lang}:`, error);
  }
}

function updateTagDisplays() {
  const fullTag = `${state.user.username}#${state.user.tag}`;
  const navBadge = document.getElementById('nav-user-badge');
  if (navBadge) navBadge.textContent = fullTag;

  const friendsBadge = document.getElementById('friends-tag-badge');
  if (friendsBadge) friendsBadge.textContent = fullTag;
}

function goToStep(stepNumber) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  
  if (stepNumber === 1 || stepNumber === 'friends' || stepNumber === 'history' || stepNumber === 'settings' || stepNumber === 'achievements' || stepNumber === 'custom-decks') {
    const appShell = document.querySelector('.app-shell');
    if (appShell) {
      appShell.className = 'app-shell';
    }
  }

  if (stepNumber === 'friends') {
    document.getElementById('step-friends').classList.add('active');
    renderFriendsChips();
  } else if (stepNumber === 'settings') {
    document.getElementById('step-settings').classList.add('active');
    const usernameInput = document.getElementById('username-input');
    usernameInput.value = state.user.username === "Jugador" ? "" : state.user.username;

    document.getElementById('volume-slider').value = state.user.audioSettings.volume;
    document.getElementById('volume-val').textContent = `${state.user.audioSettings.volume}%`;
    document.getElementById('sfx-toggle').checked = state.user.audioSettings.sfxEnabled;
    document.getElementById('music-toggle').checked = state.user.audioSettings.musicEnabled;
  } else if (stepNumber === 'history') {
    document.getElementById('step-history').classList.add('active');
    renderHistory();
  } else if (stepNumber === 'user-profile') {
    document.getElementById('step-user-profile').classList.add('active');
  } else if (stepNumber === 'question-detail') {
    document.getElementById('step-question-detail').classList.add('active');
  } else if (stepNumber === 'achievements') {
    document.getElementById('step-achievements').classList.add('active');
    renderAchievements();
  } else if (stepNumber === 'custom-decks') {
    document.getElementById('step-custom-decks').classList.add('active');
    renderCustomDecksUI();
  } else {
    document.getElementById(`step-${stepNumber}`).classList.add('active');
    if (stepNumber === 1 || stepNumber === 4) {
      switchMusicTrack('menu');
    }
    if (stepNumber === 4) {
      setupRealtimeComments();
    } else {
      if (state.unsubscribeComments) {
        state.unsubscribeComments();
        state.unsubscribeComments = null;
      }
    }
  }
  state.currentStep = stepNumber;
}

document.getElementById('logo-btn').addEventListener('click', () => { switchMusicTrack('menu'); goToStep(1); });
document.getElementById('friends-btn').addEventListener('click', () => goToStep('friends'));
document.getElementById('history-btn').addEventListener('click', () => goToStep('history'));
document.getElementById('nav-achievements-btn').addEventListener('click', () => goToStep('achievements'));
document.getElementById('open-custom-decks-btn').addEventListener('click', () => goToStep('custom-decks'));
document.getElementById('close-friends-btn').addEventListener('click', () => goToStep(1));
document.getElementById('close-history-btn').addEventListener('click', () => goToStep(1));
document.getElementById('close-profile-btn').addEventListener('click', () => goToStep(4));
document.getElementById('close-achievements-btn').addEventListener('click', () => goToStep(1));
document.getElementById('close-custom-decks-btn').addEventListener('click', () => goToStep(1));

document.getElementById('settings-btn').addEventListener('click', () => goToStep('settings'));
document.getElementById('close-settings-btn').addEventListener('click', () => goToStep(1));

const volumeSlider = document.getElementById('volume-slider');
const volumeVal = document.getElementById('volume-val');

volumeSlider.addEventListener('input', (e) => {
  const val = e.target.value;
  volumeVal.textContent = `${val}%`;
  state.user.audioSettings.volume = val;
});

document.getElementById('save-settings-btn').addEventListener('click', () => {
  const usernameInput = document.getElementById('username-input');
  const newName = usernameInput.value.trim();

  state.user.username = newName !== "" ? newName : "Jugador";
  state.user.audioSettings.sfxEnabled = document.getElementById('sfx-toggle').checked;
  state.user.audioSettings.musicEnabled = document.getElementById('music-toggle').checked;
  state.user.audioSettings.volume = parseInt(document.getElementById('volume-slider').value);
  
  localStorage.setItem('debate_party_user', JSON.stringify({
    username: state.user.username,
    tag: state.user.tag
  }));

  updateTagDisplays();
  setYoutubeVolume();
  
  alert(currentLang === 'es' ? "¡Ajustes guardados!" : "Settings saved!");
  goToStep(1);
});

document.getElementById('save-deck-btn').addEventListener('click', () => {
  const nameInput = document.getElementById('deck-name-input');
  const questionsInput = document.getElementById('deck-questions-input');

  const name = nameInput.value.trim();
  const rawQuestions = questionsInput.value.trim();

  if (!name || !rawQuestions) {
    alert(currentLang === 'es' ? "Introduce un nombre y al menos una pregunta." : "Enter a name and at least one question.");
    return;
  }

  const questions = rawQuestions.split('\n').map(q => q.trim()).filter(q => q.length > 0);
  if (questions.length === 0) {
    alert(currentLang === 'es' ? "Introduce preguntas válidas." : "Enter valid questions.");
    return;
  }

  const newDeck = {
    id: 'custom_' + Date.now(),
    name: name,
    questions: questions
  };

  customDecks.push(newDeck);
  saveCustomDecksStorage();
  loadQuestionsDatabase(currentLang);

  nameInput.value = '';
  questionsInput.value = '';

  renderCustomDecksUI();
  alert(currentLang === 'es' ? "🎉 ¡Mazo creado con éxito!" : "🎉 Custom deck created successfully!");
});

function renderCustomDecksUI() {
  const container = document.getElementById('custom-decks-list');
  if (!container) return;
  container.innerHTML = '';

  if (customDecks.length === 0) {
    container.innerHTML = `<p style="font-size: 0.85rem; color: #64748b; text-align: center; padding: 10px;">${TRANSLATIONS[currentLang].no_custom_decks}</p>`;
    return;
  }

  customDecks.forEach(deck => {
    const card = document.createElement('div');
    card.className = 'custom-deck-card';
    card.innerHTML = `
      <div class="custom-deck-info">
        <span class="custom-deck-title">🗂️ ${escapeHtml(deck.name)}</span>
        <small class="custom-deck-meta">${deck.questions.length} ${currentLang === 'es' ? 'preguntas' : 'questions'}</small>
      </div>
      <div class="deck-actions-row">
        <button class="btn-pop-sm btn-green play-custom-deck-btn" data-id="${deck.id}" style="font-size:0.75rem;">${TRANSLATIONS[currentLang].btn_play_deck}</button>
        <button class="btn-pop-sm btn-pink delete-custom-deck-btn" data-id="${deck.id}" style="font-size:0.75rem;">${TRANSLATIONS[currentLang].btn_delete_deck}</button>
      </div>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll('.play-custom-deck-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      const deck = customDecks.find(d => d.id === id);
      if (!deck || deck.questions.length === 0) {
        alert(currentLang === 'es' ? "Este mazo está vacío." : "This deck is empty.");
        return;
      }
      state.isRouletteMode = false;
      state.selectedCategory = deck.id;
      DATABASE[deck.id] = deck.questions;
      applyCategoryTheme('custom');
      document.getElementById('selected-topic-pill').textContent = `🗂️ ${deck.name}`;
      goToStep(2);
    });
  });

  container.querySelectorAll('.delete-custom-deck-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      customDecks = customDecks.filter(d => d.id !== id);
      saveCustomDecksStorage();
      renderCustomDecksUI();
    });
  });
}

function setupPickerTheme() {
  const pickerSelect = document.getElementById('picker-cat-select');
  if (!pickerSelect) return;

  const updatePickerColor = () => {
    const val = pickerSelect.value;
    if (val === 'all') {
      pickerSelect.style.backgroundColor = '#ffffff';
      pickerSelect.style.color = '#1e1b4b';
    } else {
      const theme = CATEGORY_COLORS[val] || { bg: '#ffffff', text: '#1e1b4b' };
      pickerSelect.style.backgroundColor = theme.bg;
      pickerSelect.style.color = theme.text;
    }
  };

  pickerSelect.addEventListener('change', updatePickerColor);
  updatePickerColor();
}

function setupQuestionPickerEvents() {
  const openBtn = document.getElementById('open-question-picker-btn');
  const closeBtn = document.getElementById('close-question-picker');
  const overlay = document.getElementById('question-picker-overlay');
  const catSelect = document.getElementById('picker-cat-select');
  const searchInput = document.getElementById('picker-search-input');

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      renderPickerQuestions();
      overlay.classList.remove('hidden');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.add('hidden');
    });
  }

  if (catSelect) catSelect.addEventListener('change', renderPickerQuestions);
  if (searchInput) searchInput.addEventListener('input', renderPickerQuestions);
}

function renderPickerQuestions() {
  const container = document.getElementById('picker-questions-list');
  const catSelect = document.getElementById('picker-cat-select');
  const searchInput = document.getElementById('picker-search-input');
  if (!container) return;

  container.innerHTML = '';
  const selectedCat = catSelect ? catSelect.value : 'all';
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

  let results = [];
  const categoriesToSearch = selectedCat === 'all' ? Object.keys(DATABASE) : [selectedCat];

  categoriesToSearch.forEach(catKey => {
    if (catKey.startsWith('custom_')) return;
    const questionsList = DATABASE[catKey] || [];
    questionsList.forEach(q => {
      if (!searchTerm || q.toLowerCase().includes(searchTerm)) {
        results.push({ category: catKey, text: q });
      }
    });
  });

  if (results.length === 0) {
    container.innerHTML = `<p style="font-size: 0.8rem; color: #64748b; text-align: center; padding: 10px;">${currentLang === 'es' ? "No se encontraron preguntas." : "No questions found."}</p>`;
    return;
  }

  results.forEach(item => {
    const theme = CATEGORY_COLORS[item.category] || { bg: '#ffffff', text: '#1e1b4b', border: '#cbd5e1' };
    const topicKey = `topic_${item.category}_title`;
    const catDisplayName = TRANSLATIONS[currentLang][topicKey] || item.category;

    const card = document.createElement('div');
    card.className = 'comment-card';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.gap = '6px';
    card.style.padding = '10px 12px';
    card.style.backgroundColor = theme.bg;
    card.style.color = theme.text;
    card.style.border = `2px solid ${theme.border}`;
    card.style.borderRadius = '12px';

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
        <span style="font-size: 0.7rem; font-weight: 900; background: rgba(0,0,0,0.1); padding: 2px 8px; border-radius: 8px;">🏷️ ${catDisplayName}</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; width: 100%;">
        <div style="font-size: 0.85rem; font-weight: 800; flex: 1; line-height: 1.3;">${escapeHtml(item.text)}</div>
        <button class="btn-pop-sm picker-add-btn" style="font-size: 0.75rem; white-space: nowrap; background: ${theme.text}; color: ${theme.bg}; border: none; font-weight: 900; cursor: pointer; padding: 6px 10px; border-radius: 8px;">${TRANSLATIONS[currentLang].picker_add}</button>
      </div>
    `;

    card.querySelector('.picker-add-btn').addEventListener('click', () => {
      const textarea = document.getElementById('deck-questions-input');
      if (textarea) {
        const currentVal = textarea.value.trim();
        textarea.value = currentVal ? `${currentVal}\n${item.text}` : item.text;
        playSound('click');
        const btn = card.querySelector('.picker-add-btn');
        const originalBg = btn.style.background;
        const originalText = btn.textContent;
        btn.style.background = '#10b981';
        btn.style.color = '#ffffff';
        btn.textContent = '✓';
        setTimeout(() => {
          btn.style.background = originalBg;
          btn.style.color = originalText === '✓' ? (theme.bg) : originalText;
          btn.textContent = originalText;
        }, 600);
      }
    });

    container.appendChild(card);
  });
}

document.getElementById('roulette-btn').addEventListener('click', () => {
  playSound('start');
  state.isRouletteMode = true;

  const topicCards = document.querySelectorAll('.topic-card');
  const topics = Array.from(topicCards).map(card => card.dataset.topic);
  
  const allPool = [...topics, ...customDecks.map(d => d.id)];
  const randomSelection = allPool[Math.floor(Math.random() * allPool.length)];
  state.selectedCategory = randomSelection;

  if (!state.stats.rouletteCount) state.stats.rouletteCount = 0;
  state.stats.rouletteCount++;
  saveUserStats();
  checkAndUnlockAchievements();

  document.getElementById('selected-topic-pill').textContent = TRANSLATIONS[currentLang].mystery_category;
  goToStep(2);
});

document.querySelectorAll('.topic-card').forEach(card => {
  card.addEventListener('click', () => {
    const topic = card.dataset.topic;

    if (topic === 'spicy') {
      document.getElementById('age-verify-overlay').classList.remove('hidden');
      return;
    }

    state.isRouletteMode = false;
    state.selectedCategory = topic;
    applyCategoryTheme(topic);

    const topicKey = `topic_${topic}_title`;
    document.getElementById('selected-topic-pill').textContent = TRANSLATIONS[currentLang][topicKey] || topic;
    goToStep(2);
  });
});

document.getElementById('age-yes-btn').addEventListener('click', () => {
  document.getElementById('age-verify-overlay').classList.add('hidden');
  state.isRouletteMode = false;
  state.selectedCategory = 'spicy';
  applyCategoryTheme('spicy');

  const topicKey = `topic_spicy_title`;
  document.getElementById('selected-topic-pill').textContent = TRANSLATIONS[currentLang][topicKey] || 'spicy';
  goToStep(2);
});

document.getElementById('age-no-btn').addEventListener('click', () => {
  document.getElementById('age-verify-overlay').classList.add('hidden');
});

const timerRange = document.getElementById('timer-range');
const dialTextVal = document.getElementById('dial-text-val');
const dialProgress = document.getElementById('dial-progress');

function setTimerDuration(seconds) {
  state.timerDurationSecs = seconds;
  timerRange.value = seconds;

  if (seconds === 0) {
    dialTextVal.textContent = TRANSLATIONS[currentLang].dial_no_limit;
  } else {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    dialTextVal.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  const offset = 314 - (314 * (seconds / 3600));
  dialProgress.style.strokeDashoffset = offset;

  document.querySelectorAll('.quick-time-btn').forEach(btn => {
    const secsAttr = parseInt(btn.dataset.secs);
    if (secsAttr === seconds) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

timerRange.addEventListener('input', (e) => {
  setTimerDuration(parseInt(e.target.value));
});

function setupQuickTimeButtons() {
  document.querySelectorAll('.quick-time-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      setTimerDuration(parseInt(btn.dataset.secs));
    });
  });
}

document.getElementById('back-to-step1-btn').addEventListener('click', () => {
  switchMusicTrack('menu');
  goToStep(1);
});

document.getElementById('start-game-btn').addEventListener('click', () => {
  playSound('start');
  switchMusicTrack('debate');
  const isCustomDeck = customDecks.some(d => d.id === state.selectedCategory);
  applyCategoryTheme(isCustomDeck ? 'custom' : state.selectedCategory);
  startMatch();
});

// 🔄 FILTRO ANTI-REPETICIÓN DE PREGUNTAS Y CONTADOR EN VIVO (MANTIENE LA MISMA CATEGORÍA)
function startMatch() {
  const list = DATABASE[state.selectedCategory] || [];
  if (list.length === 0) {
    alert("⚠️ Carga el archivo JSON o añade preguntas al mazo.");
    return;
  }

  let availableList = list.filter(q => !state.seenQuestions.has(q));

  if (availableList.length === 0) {
    alert(currentLang === 'es' ? "🔄 ¡Has jugado todas las preguntas de esta categoría! Reiniciando ciclo." : "🔄 You've played all questions in this category! Resetting cycle.");
    list.forEach(q => state.seenQuestions.delete(q));
    availableList = list;
  }

  const randomIndex = Math.floor(Math.random() * availableList.length);
  state.currentQuestionText = availableList[randomIndex];
  state.seenQuestions.add(state.currentQuestionText);

  const totalCatCount = list.length;
  const seenCatCount = list.filter(q => state.seenQuestions.has(q)).length;
  const progressBadge = document.getElementById('question-progress-badge');
  if (progressBadge) {
    progressBadge.textContent = `${seenCatCount}/${totalCatCount}`;
  }

  document.getElementById('question-text').textContent = state.currentQuestionText;
  
  const topicKey = `topic_${state.selectedCategory}_title`;
  const isCustom = customDecks.find(d => d.id === state.selectedCategory);
  const categoryDisplayName = isCustom ? `🗂️ ${isCustom.name}` : (TRANSLATIONS[currentLang][topicKey] || state.selectedCategory.toUpperCase());
  document.getElementById('game-category-tag').textContent = categoryDisplayName;

  document.getElementById('question-box').style.filter = 'none';

  loadQuestionVotes();

  clearInterval(state.timerInterval);
  const timerHero = document.getElementById('game-timer-container');
  document.getElementById('time-up-overlay').classList.add('hidden');

  if (state.timerDurationSecs > 0) {
    timerHero.classList.remove('hidden');
    state.timeLeftSecs = state.timerDurationSecs;
    runLiveTimer();
  } else {
    timerHero.classList.add('hidden');
  }

  goToStep(3);
}

// DETECTOR INTELIGENTE SÍ / NO / OPCIÓN A-B (Más robusto)
function isYesNoQuestion(questionText) {
  const text = questionText.trim().toLowerCase();

  // Si empieza por "¿preferirías" o "¿prefieres", o contiene disyuntivas (" o ", " pero "), es Opción A / Opción B
  if (text.startsWith('¿preferirías') || text.startsWith('¿prefieres') || text.includes(' o ') || text.includes(' pero ')) {
    return false;
  }

  const isOpenEnded = (
    text.startsWith('¿cómo') || 
    text.startsWith('¿qué') || 
    text.startsWith('¿cuál') || 
    text.startsWith('¿quién') || 
    text.startsWith('¿dónde') || 
    text.startsWith('¿por qué')
  );
  if (isOpenEnded) return false;

  const isExplicitChoice = text.includes('preferirías') || text.includes(' prefieres ') || text.includes(' antes que ');
  return !isExplicitChoice;
}

async function loadQuestionVotes() {
  state.hasVotedCurrent = false;
  document.getElementById('voting-buttons-box').classList.remove('hidden');
  document.getElementById('voting-results-box').classList.add('hidden');

  const isYesNo = isYesNoQuestion(state.currentQuestionText);

  if (isYesNo) {
    state.currentVoteLabels = {
      a: currentLang === 'es' ? '👍 Sí' : '👍 Yes',
      b: currentLang === 'es' ? '👎 No' : '👎 No'
    };
  } else {
    state.currentVoteLabels = {
      a: currentLang === 'es' ? '🅰️ Opción A' : '🅰️ Option A',
      b: currentLang === 'es' ? '🅱️ Opción B' : '🅱️ Option B'
    };
  }

  document.getElementById('vote-a-btn').textContent = state.currentVoteLabels.a;
  document.getElementById('vote-b-btn').textContent = state.currentVoteLabels.b;

  try {
    const qRef = collection(db, 'question_stats');
    const qFiltered = query(qRef, where('questionText', '==', state.currentQuestionText));
    const snapshot = await getDocs(qFiltered);

    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      state.currentQuestionDocId = docSnap.id;
      updateVotingUI(docSnap.data());
    } else {
      state.currentQuestionDocId = null;
      updateVotingUI({ votesA: 0, votesB: 0 });
    }
  } catch (e) {
    console.error("Error al cargar votos de la pregunta:", e);
  }
}

async function castVote(option) {
  if (state.hasVotedCurrent) return;
  state.hasVotedCurrent = true;
  playSound('click');

  if (!state.stats.votesCast) state.stats.votesCast = 0;
  state.stats.votesCast++;
  saveUserStats();
  checkAndUnlockAchievements();

  try {
    const qRef = collection(db, 'question_stats');

    if (state.currentQuestionDocId) {
      const ref = doc(db, 'question_stats', state.currentQuestionDocId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        const currentA = data.votesA || 0;
        const currentB = data.votesB || 0;
        const updates = option === 'A' ? { votesA: currentA + 1 } : { votesB: currentB + 1 };
        await updateDoc(ref, updates);
        updateVotingUI({ 
          votesA: option === 'A' ? currentA + 1 : currentA, 
          votesB: option === 'B' ? currentB + 1 : currentB 
        });
      }
    } else {
      const newDoc = await addDoc(qRef, {
        questionText: state.currentQuestionText,
        votesA: option === 'A' ? 1 : 0,
        votesB: option === 'B' ? 1 : 0,
        createdAt: serverTimestamp()
      });
      state.currentQuestionDocId = newDoc.id;
      updateVotingUI({ 
        votesA: option === 'A' ? 1 : 0, 
        votesB: option === 'B' ? 1 : 0 
      });
    }

    document.getElementById('voting-buttons-box').classList.add('hidden');
    document.getElementById('voting-results-box').classList.remove('hidden');
  } catch (e) {
    console.error("❌ Error al registrar el voto en Firebase:", e);
    state.hasVotedCurrent = false; 
    alert("Hubo un error al registrar el voto. Revisa la consola (F12).");
  }
}

function updateVotingUI(data) {
  const votesA = data.votesA || 0;
  const votesB = data.votesB || 0;
  const total = votesA + votesB;

  const pctA = total > 0 ? Math.round((votesA / total) * 100) : 50;
  const pctB = total > 0 ? Math.round((votesB / total) * 100) : 50;
  
  state.currentVoteResults = { pctA, pctB, total };

  const labelA = state.currentVoteLabels ? state.currentVoteLabels.a : 'A';
  const labelB = state.currentVoteLabels ? state.currentVoteLabels.b : 'B';

  document.getElementById('label-vote-a').textContent = `${labelA} (${votesA}): ${pctA}%`;
  document.getElementById('label-vote-b').textContent = `${labelB} (${votesB}): ${pctB}%`;
  document.getElementById('bar-vote-a').style.width = `${pctA}%`;
  document.getElementById('bar-vote-b').style.width = `${pctB}%`;
  
  const totalText = currentLang === 'es' ? `Total votos de la comunidad: ${total}` : `Total community votes: ${total}`;
  document.getElementById('total-votes-text').textContent = totalText;
}

document.getElementById('vote-a-btn').addEventListener('click', () => castVote('A'));
document.getElementById('vote-b-btn').addEventListener('click', () => castVote('B'));

function runLiveTimer() {
  const ringFill = document.getElementById('game-ring-fill');
  const digits = document.getElementById('game-timer-digits');
  const total = state.timerDurationSecs;

  const updateDisplay = () => {
    const m = Math.floor(state.timeLeftSecs / 60);
    const s = state.timeLeftSecs % 60;
    digits.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;

    const offset = 326 * (1 - (state.timeLeftSecs / total));
    ringFill.style.strokeDashoffset = offset;
  };

  updateDisplay();

  state.timerInterval = setInterval(() => {
    state.timeLeftSecs--;
    updateDisplay();

    if (state.timeLeftSecs <= 10 && state.timeLeftSecs > 0) {
      playSound('tick');
    }

    if (state.timeLeftSecs <= 0) {
      clearInterval(state.timerInterval);
      digits.textContent = "00:00";
      playSound('timeup');
      document.getElementById('question-box').style.filter = 'blur(8px)';
      document.getElementById('time-up-overlay').classList.remove('hidden');
    }
  }, 1000);
}

document.getElementById('add-1min-btn').addEventListener('click', () => addExtraTime(60));
document.getElementById('add-5min-btn').addEventListener('click', () => addExtraTime(300));

function addExtraTime(seconds) {
  state.timerDurationSecs += seconds;
  state.timeLeftSecs += seconds;
  document.getElementById('question-box').style.filter = 'none';
  document.getElementById('time-up-overlay').classList.add('hidden');
  runLiveTimer();
}

document.getElementById('finish-game-btn').addEventListener('click', endMatch);
document.getElementById('time-up-finish-btn').addEventListener('click', endMatch);

function endMatch() {
  clearInterval(state.timerInterval);
  document.getElementById('time-up-overlay').classList.add('hidden');

  if (!state.stats.debatesPlayed) state.stats.debatesPlayed = 0;
  state.stats.debatesPlayed++;

  const isCustom = customDecks.some(d => d.id === state.selectedCategory);
  if (state.selectedCategory === 'philosophy') {
    if (!state.stats.philosophyCount) state.stats.philosophyCount = 0;
    state.stats.philosophyCount++;
  }
  if (!Array.isArray(state.stats.categoriesPlayed)) {
    state.stats.categoriesPlayed = [];
  }
  if (!state.stats.categoryCounts) {
    state.stats.categoryCounts = {};
  }
  if (!state.stats.categoryCounts[state.selectedCategory]) {
    state.stats.categoryCounts[state.selectedCategory] = 0;
  }
  state.stats.categoryCounts[state.selectedCategory]++;

  if (!state.stats.categoriesPlayed.includes(state.selectedCategory) && !isCustom) {
    state.stats.categoriesPlayed.push(state.selectedCategory);
  }
  
  saveUserStats();
  checkAndUnlockAchievements();

  const now = new Date();
  const timeString = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  
  const displayCatName = isCustom ? (customDecks.find(d => d.id === state.selectedCategory)?.name || 'Custom') : state.selectedCategory.toUpperCase();

  state.matchHistory.unshift({
    category: displayCatName,
    question: state.currentQuestionText,
    timestamp: timeString
  });

  switchMusicTrack('menu');
  goToStep(4);
}

// Botón de Siguiente Debate (Mantiene la misma categoría actual)
document.getElementById('next-question-same-config-btn').addEventListener('click', () => {
  playSound('start');
  switchMusicTrack('debate');
  const isCustom = customDecks.some(d => d.id === state.selectedCategory);
  applyCategoryTheme(isCustom ? 'custom' : state.selectedCategory);
  startMatch();
});

document.getElementById('go-home-btn').addEventListener('click', () => {
  switchMusicTrack('menu');
  goToStep(1);
});

function renderHistory() {
  const container = document.getElementById('history-list');
  container.innerHTML = '';

  if (state.matchHistory.length === 0) {
    container.innerHTML = `<p style="font-size: 0.85rem; color: #64748b; text-align: center; padding: 20px;">${TRANSLATIONS[currentLang].no_history}</p>`;
    return;
  }

  state.matchHistory.forEach(match => {
    const card = document.createElement('div');
    card.className = 'comment-card history-card';
    card.innerHTML = `
      <div class="comment-header">
        <span style="color: var(--pop-purple); font-weight: 900;">🏷️ ${escapeHtml(match.category)}</span>
        <span style="font-size: 0.7rem; color: #94a3b8;">📅 ${escapeHtml(match.timestamp)}</span>
      </div>
      <div class="comment-text" style="font-size: 0.95rem;">"${escapeHtml(match.question)}"</div>
      <div style="font-size: 0.75rem; color: #8b5cf6; font-weight: 800; margin-top: 4px;">
        💬 ${currentLang === 'es' ? "Ver votos, respuestas de la comunidad y tus comentarios ➔" : "View votes, community answers & your comments ➔"}
      </div>
    `;

    card.addEventListener('click', () => {
      playSound('click');
      openQuestionDetail(match.question, match.category);
    });

    container.appendChild(card);
  });
}

function renderAchievements() {
  document.getElementById('stat-debates-played').textContent = state.stats.debatesPlayed || 0;
  document.getElementById('stat-proposals').textContent = state.stats.proposalsCount || 0;

  const container = document.getElementById('achievements-list');
  container.innerHTML = '';

  const unlockedSet = state.stats.unlockedAchievements || [];

  const processedAchievements = ACHIEVEMENTS_DATA.map(ach => {
    const isUnlocked = unlockedSet.includes(ach.id);
    return { ...ach, isUnlocked };
  });

  processedAchievements.sort((a, b) => {
    return (b.isUnlocked ? 1 : 0) - (a.isUnlocked ? 1 : 0);
  });

  processedAchievements.forEach(ach => {
    const title = currentLang === 'es' ? ach.titleEs : ach.titleEn;
    const desc = currentLang === 'es' ? ach.descEs : ach.descEn;

    const card = document.createElement('div');
    card.className = `achievement-card ${ach.isUnlocked ? 'unlocked' : 'locked'}`;
    card.innerHTML = `
      <span class="achievement-icon">${ach.icon}</span>
      <div class="achievement-info">
        <span class="achievement-title">${title}</span>
        <small class="achievement-desc">${desc}</small>
      </div>
      <span class="achievement-status">${ach.isUnlocked ? TRANSLATIONS[currentLang].unlocked : TRANSLATIONS[currentLang].locked}</span>
    `;
    container.appendChild(card);
  });
}

async function openQuestionDetail(questionText, categoryName) {
  state.detailQuestionText = questionText;
  state.detailCategory = categoryName;

  document.getElementById('detail-question-text').textContent = questionText;
  
  const catLower = categoryName.toLowerCase();
  const topicKey = `topic_${catLower}_title`;
  const isCustom = customDecks.find(d => d.name.toLowerCase() === catLower);
  const categoryDisplayName = isCustom ? `🗂️ ${isCustom.name}` : (TRANSLATIONS[currentLang][topicKey] || categoryName);
  document.getElementById('detail-category-pill').textContent = categoryDisplayName;
  
  applyCategoryTheme(isCustom ? 'custom' : catLower);
  goToStep('question-detail');
  
  await fetchDetailQuestionVotes(questionText);

  setupDetailCommentsRealtime();
}

async function fetchDetailQuestionVotes(questionText) {
  try {
    const qRef = collection(db, 'question_stats');
    const qFiltered = query(qRef, where('questionText', '==', questionText));
    const snapshot = await getDocs(qFiltered);

    const isYesNo = isYesNoQuestion(questionText);

    const labelA = isYesNo ? (currentLang === 'es' ? '👍 Sí' : '👍 Yes') : (currentLang === 'es' ? '🅰️ Opción A' : '🅰️ Option A');
    const labelB = isYesNo ? (currentLang === 'es' ? '👎 No' : '👎 No') : (currentLang === 'es' ? '🅱️ Opción B' : '🅱️ Option B');

    state.currentVoteLabels = { a: labelA, b: labelB };

    let votesA = 0;
    let votesB = 0;

    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      votesA = data.votesA || 0;
      votesB = data.votesB || 0;
    }

    const total = votesA + votesB;
    const pctA = total > 0 ? Math.round((votesA / total) * 100) : 50;
    const pctB = total > 0 ? Math.round((votesB / total) * 100) : 50;

    state.currentVoteResults = { pctA, pctB, total };

    document.getElementById('detail-label-vote-a').textContent = `${labelA} (${votesA}): ${pctA}%`;
    document.getElementById('detail-label-vote-b').textContent = `${labelB} (${votesB}): ${pctB}%`;
    document.getElementById('detail-bar-vote-a').style.width = `${pctA}%`;
    document.getElementById('detail-bar-vote-b').style.width = `${pctB}%`;
    
    const totalText = currentLang === 'es' ? `Total votos de la comunidad: ${total}` : `Total community votes: ${total}`;
    document.getElementById('detail-total-votes-text').textContent = totalText;

  } catch (e) {
    console.error("Error al cargar votos del historial:", e);
  }
}

document.getElementById('close-detail-btn').addEventListener('click', () => {
  playSound('click');
  if (state.unsubscribeDetailComments) {
    state.unsubscribeDetailComments();
    state.unsubscribeDetailComments = null;
  }
  goToStep('history');
});

function setupDetailCommentsRealtime() {
  if (state.unsubscribeDetailComments) {
    state.unsubscribeDetailComments();
  }

  const qRef = collection(db, 'debate_comments');
  const qFiltered = query(qRef, where('questionText', '==', state.detailQuestionText));

  state.unsubscribeDetailComments = onSnapshot(qFiltered, (snapshot) => {
    const qComments = [];
    snapshot.forEach((docSnap) => {
      qComments.push({ id: docSnap.id, ...docSnap.data() });
    });

    sortAndRenderDetailComments(qComments);
  }, (error) => {
    console.error("Error al escuchar comentarios de detalle:", error);
  });
}

function sortAndRenderDetailComments(commentsList) {
  commentsList.sort((a, b) => {
    const timeA = a.createdAt?.toMillis() || 0;
    const timeB = b.createdAt?.toMillis() || 0;
    const likesA = a.likes || 0;
    const likesB = b.likes || 0;

    if (state.commentSortMode === 'newest') {
      return timeB - timeA;
    } else if (state.commentSortMode === 'oldest') {
      return timeA - timeB;
    } else if (state.commentSortMode === 'popular') {
      return likesB - likesA;
    }
    return 0;
  });

  renderDetailCommentsUI(commentsList);
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    playSound('click');
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    state.commentSortMode = e.target.dataset.sort;
    setupDetailCommentsRealtime();
  });
});

document.getElementById('detail-send-comment-btn').addEventListener('click', async () => {
  const input = document.getElementById('detail-comment-input');
  const text = input.value.trim();
  if (!text) return;

  const now = new Date();
  const timeString = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  try {
    await addDoc(collection(db, 'debate_comments'), {
      questionText: state.detailQuestionText,
      author: `${state.user.username}#${state.user.tag}`,
      text: text,
      timestamp: timeString,
      createdAt: serverTimestamp(),
      likes: 0,
      dislikes: 0,
      reported: false,
      replies: []
    });
    input.value = '';
  } catch (error) {
    console.error("Error al enviar comentario:", error);
  }
});

function renderDetailCommentsUI(qComments) {
  const container = document.getElementById('detail-comments-list');
  container.innerHTML = '';

  const activeComments = qComments.filter(c => !c.reported);

  if (activeComments.length === 0) {
    container.innerHTML = `<p style="font-size: 0.8rem; color: var(--panel-text); opacity: 0.8; text-align: center; padding: 10px;">${currentLang === 'es' ? "Sé el primero en comentar sobre este debate." : "Be the first to comment on this debate."}</p>`;
    return;
  }

  activeComments.forEach((comm) => {
    const card = document.createElement('div');
    card.className = 'comment-card';
    card.innerHTML = `
      <div class="comment-header">
        <span>👤 <span class="profile-link" data-author="${escapeHtml(comm.author)}">${escapeHtml(comm.author)}</span></span>
        <span style="font-size:0.7rem; color:#94a3b8;">${escapeHtml(comm.timestamp)}</span>
      </div>
      <div class="comment-text">${escapeHtml(comm.text)}</div>
      <div class="comment-actions">
        <button class="comment-action-btn detail-like-btn" data-id="${comm.id}">👍 ${comm.likes || 0}</button>
        <button class="comment-action-btn detail-dislike-btn" data-id="${comm.id}">👎 ${comm.dislikes || 0}</button>
        <button class="comment-action-btn detail-reply-toggle-btn" data-id="${comm.id}">${currentLang === 'es' ? "Responder" : "Reply"}</button>
        <button class="comment-action-btn detail-report-btn" data-id="${comm.id}" style="color:#ef4444; font-size:0.75rem;">🚩 ${currentLang === 'es' ? "Denunciar" : "Report"}</button>
      </div>
      <div class="replies-container" id="detail-replies-${comm.id}">
        ${(comm.replies || []).map(r => `<div class="comment-card" style="background:#f1f5f9;"><div class="comment-header"><span>👤 <span class="profile-link" data-author="${escapeHtml(r.author)}">${escapeHtml(r.author)}</span></span><span style="font-size:0.65rem; color:#94a3b8;">${escapeHtml(r.timestamp)}</span></div><div class="comment-text" style="font-size:0.8rem;">${escapeHtml(r.text)}</div></div>`).join('')}
      </div>
      <div class="reply-input-box hidden" id="detail-reply-box-${comm.id}">
        <input type="text" class="custom-input reply-input" placeholder="${currentLang === 'es' ? "Escribe una respuesta..." : "Write a reply..."}" id="detail-reply-text-${comm.id}" style="font-size:0.8rem; padding:6px;" />
        <button class="btn-pop-sm btn-purple detail-submit-reply-btn" data-id="${comm.id}" style="font-size:0.75rem;">OK</button>
      </div>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll('.detail-like-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      const ref = doc(db, 'debate_comments', id);
      const documentSnap = await getDoc(ref);
      if (documentSnap.exists()) {
        const currentLikes = documentSnap.data().likes || 0;
        await updateDoc(ref, { likes: currentLikes + 1 });
      }
    });
  });

  container.querySelectorAll('.detail-dislike-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      const ref = doc(db, 'debate_comments', id);
      const documentSnap = await getDoc(ref);
      if (documentSnap.exists()) {
        const currentDislikes = documentSnap.data().dislikes || 0;
        await updateDoc(ref, { dislikes: currentDislikes + 1 });
      }
    });
  });

  container.querySelectorAll('.detail-report-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      const ref = doc(db, 'debate_comments', id);
      await updateDoc(ref, { reported: true });
    });
  });

  container.querySelectorAll('.profile-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const authorTag = e.target.dataset.author;
      openUserProfile(authorTag);
    });
  });

  container.querySelectorAll('.detail-reply-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      document.getElementById(`detail-reply-box-${id}`).classList.toggle('hidden');
    });
  });

  container.querySelectorAll('.detail-submit-reply-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      const input = document.getElementById(`detail-reply-text-${id}`);
      const text = input.value.trim();
      if (!text) return;

      const now = new Date();
      const timeString = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      
      const newReply = {
        author: `${state.user.username}#${state.user.tag}`,
        text: text,
        timestamp: timeString
      };

      const ref = doc(db, 'debate_comments', id);
      const documentSnap = await getDoc(ref);
      if (documentSnap.exists()) {
        const replies = documentSnap.data().replies || [];
        replies.push(newReply);
        await updateDoc(ref, { replies: replies });
      }
    });
  });
}

async function openUserProfile(authorTag) {
  document.getElementById('profile-title-name').textContent = `Perfil de ${authorTag}`;
  const container = document.getElementById('profile-opinions-container');
  container.innerHTML = `<p style="font-size: 0.85rem; color: var(--panel-text); opacity: 0.8; text-align: center; padding: 15px;">${currentLang === 'es' ? "Buscando debates en la nube..." : "Searching debates in the cloud..."}</p>`;

  goToStep('user-profile');

  try {
    const qRef = collection(db, 'debate_comments');
    const qFiltered = query(qRef, where('author', '==', authorTag));
    const querySnapshot = await getDocs(qFiltered);

    container.innerHTML = '';
    const userComments = [];
    querySnapshot.forEach((docSnap) => {
      userComments.push({ id: docSnap.id, ...docSnap.data() });
    });

    if (userComments.length === 0) {
      container.innerHTML = `<p style="font-size: 0.85rem; color: var(--panel-text); opacity: 0.8; text-align: center; padding: 15px;">${currentLang === 'es' ? "Este usuario no tiene opiniones públicas registradas." : "This user has no public opinions recorded."}</p>`;
      return;
    }

    userComments.forEach(item => {
      const card = document.createElement('div');
      card.className = 'comment-card';
      card.innerHTML = `
        <div class="comment-header">
          <span>📅 ${escapeHtml(item.timestamp)}</span>
          <span>👍 ${item.likes || 0} | 👎 ${item.dislikes || 0}</span>
        </div>
        <p style="font-size: 0.8rem; color: #475569; font-weight: 800; margin-bottom: 4px;">❓ ${currentLang === 'es' ? "Pregunta" : "Question"}: "${escapeHtml(item.questionText)}"</p>
        <div class="comment-text" style="font-size: 0.9rem; color: #1e293b; margin-bottom: 8px;">💬 "${escapeHtml(item.text)}"</div>
        <div style="font-size: 0.75rem; font-weight: 800; color: #8b5cf6;">💬 Respuestas (${(item.replies || []).length}):</div>
        <div style="margin-left: 10px; display:flex; flex-direction:column; gap:4px; margin-top:4px;">
          ${(item.replies || []).length === 0 ? `<span style="font-size:0.75rem; color:#94a3b8;">Sin respuestas aún</span>` : item.replies.map(r => `<div style="background:#f1f5f9; padding:4px 8px; border-radius:6px; font-size:0.75rem;"><b>${escapeHtml(r.author)}:</b> ${escapeHtml(r.text)}</div>`).join('')}
        </div>
      `;
      container.appendChild(card);
    });

  } catch (error) {
    console.error("Error al cargar perfil desde Firebase:", error);
    container.innerHTML = `<p style="font-size: 0.85rem; color: #ef4444; text-align: center; padding: 15px;">Error al conectar con la base de datos.</p>`;
  }
}

document.getElementById('send-comment-btn').addEventListener('click', async () => {
  const input = document.getElementById('comment-input');
  const text = input.value.trim();
  if (!text) return;

  const now = new Date();
  const timeString = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  try {
    await addDoc(collection(db, 'debate_comments'), {
      questionText: state.currentQuestionText,
      author: `${state.user.username}#${state.user.tag}`,
      text: text,
      timestamp: timeString,
      createdAt: serverTimestamp(),
      likes: 0,
      dislikes: 0,
      reported: false,
      replies: []
    });
    input.value = '';
  } catch (error) {
    console.error("Error al enviar comentario a Firebase:", error);
  }
});

function setupRealtimeComments() {
  if (state.unsubscribeComments) {
    state.unsubscribeComments();
  }

  const qRef = collection(db, 'debate_comments');
  const qFiltered = query(qRef, where('questionText', '==', state.currentQuestionText));

  state.unsubscribeComments = onSnapshot(qFiltered, (snapshot) => {
    const qComments = [];
    snapshot.forEach((documentSnap) => {
      qComments.push({ id: documentSnap.id, ...documentSnap.data() });
    });
    qComments.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
    renderCommentsUI(qComments);
  }, (error) => {
    console.error("Error al escuchar comentarios en tiempo real:", error);
  });
}

function renderCommentsUI(qComments) {
  const container = document.getElementById('comments-list');
  container.innerHTML = '';

  const activeComments = qComments.filter(c => !c.reported);

  if (activeComments.length === 0) {
    container.innerHTML = `<p style="font-size: 0.8rem; color: var(--panel-text); opacity: 0.8; text-align: center; padding: 10px;">${currentLang === 'es' ? "Sé el primero en comentar sobre este debate." : "Be the first to comment on this debate."}</p>`;
    return;
  }

  activeComments.forEach((comm) => {
    const card = document.createElement('div');
    card.className = 'comment-card';
    card.innerHTML = `
      <div class="comment-header">
        <span>👤 <span class="profile-link" data-author="${escapeHtml(comm.author)}">${escapeHtml(comm.author)}</span></span>
        <span style="font-size:0.7rem; color:#94a3b8;">${escapeHtml(comm.timestamp)}</span>
      </div>
      <div class="comment-text">${escapeHtml(comm.text)}</div>
      <div class="comment-actions">
        <button class="comment-action-btn like-btn" data-id="${comm.id}">👍 ${comm.likes || 0}</button>
        <button class="comment-action-btn dislike-btn" data-id="${comm.id}">👎 ${comm.dislikes || 0}</button>
        <button class="comment-action-btn reply-toggle-btn" data-id="${comm.id}">${currentLang === 'es' ? "Responder" : "Reply"}</button>
        <button class="comment-action-btn report-btn" data-id="${comm.id}" style="color:#ef4444; font-size:0.75rem;">🚩 ${currentLang === 'es' ? "Denunciar" : "Report"}</button>
      </div>
      <div class="replies-container" id="replies-${comm.id}">
        ${(comm.replies || []).map(r => `<div class="comment-card" style="background:#f1f5f9;"><div class="comment-header"><span>👤 <span class="profile-link" data-author="${escapeHtml(r.author)}">${escapeHtml(r.author)}</span></span><span style="font-size:0.65rem; color:#94a3b8;">${escapeHtml(r.timestamp)}</span></div><div class="comment-text" style="font-size:0.8rem;">${escapeHtml(r.text)}</div></div>`).join('')}
      </div>
      <div class="reply-input-box hidden" id="reply-box-${comm.id}">
        <input type="text" class="custom-input reply-input" placeholder="${currentLang === 'es' ? "Escribe una respuesta..." : "Write a reply..."}" id="reply-text-${comm.id}" style="font-size:0.8rem; padding:6px;" />
        <button class="btn-pop-sm btn-purple submit-reply-btn" data-id="${comm.id}" style="font-size:0.75rem;">OK</button>
      </div>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      const ref = doc(db, 'debate_comments', id);
      const documentSnap = await getDoc(ref);
      if (documentSnap.exists()) {
        const currentLikes = documentSnap.data().likes || 0;
        await updateDoc(ref, { likes: currentLikes + 1 });
      }
    });
  });

  container.querySelectorAll('.dislike-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      const ref = doc(db, 'debate_comments', id);
      const documentSnap = await getDoc(ref);
      if (documentSnap.exists()) {
        const currentDislikes = documentSnap.data().dislikes || 0;
        await updateDoc(ref, { dislikes: currentDislikes + 1 });
      }
    });
  });

  container.querySelectorAll('.report-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      const ref = doc(db, 'debate_comments', id);
      await updateDoc(ref, { reported: true });
      alert(currentLang === 'es' ? "🚨 Comentario denunciado y ocultado." : "🚨 Comment reported and hidden.");
    });
  });

  container.querySelectorAll('.profile-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const authorTag = e.target.dataset.author;
      openUserProfile(authorTag);
    });
  });

  container.querySelectorAll('.reply-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      document.getElementById(`reply-box-${id}`).classList.toggle('hidden');
    });
  });

  container.querySelectorAll('.submit-reply-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      const input = document.getElementById(`reply-text-${id}`);
      const text = input.value.trim();
      if (!text) return;

      const now = new Date();
      const timeString = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      
      const newReply = {
        author: `${state.user.username}#${state.user.tag}`,
        text: text,
        timestamp: timeString
      };

      const ref = doc(db, 'debate_comments', id);
      const documentSnap = await getDoc(ref);
      if (documentSnap.exists()) {
        const replies = documentSnap.data().replies || [];
        replies.push(newReply);
        await updateDoc(ref, { replies: replies });
      }
    });
  });
}

document.getElementById('add-friend-btn').addEventListener('click', () => {
  const input = document.getElementById('friend-tag-input');
  const val = input.value.trim();

  if (val && val.includes('#')) {
    state.friends.push(val);
    renderFriendsChips();
    input.value = '';
    alert(currentLang === 'es' ? `¡${val} añadido!` : `¡${val} added!`);
  } else {
    alert(currentLang === 'es' ? "Introduce un tag válido Nombre#1234" : "Enter valid tag Name#1234");
  }
});

function renderFriendsChips() {
  const container = document.getElementById('friends-chips-list');
  if (container) {
    if (state.friends.length === 0) {
      container.innerHTML = `<p style="font-size: 0.85rem; color: var(--panel-text); opacity: 0.8; text-align: center; width: 100%; padding: 10px;">${TRANSLATIONS[currentLang].no_friends}</p>`;
    } else {
      container.innerHTML = state.friends.map(f => `<span class="friend-chip">👤 ${escapeHtml(f)}</span>`).join('');
    }
  }
}

// FUNCIÓN DE SEGURIDAD CONTRA XSS (Escapa caracteres HTML peligrosos)
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function generateAndShareCard(questionText, categoryName) {
  playSound('click');
  try {
    const canvas = document.getElementById('share-canvas');
    if (!canvas) {
      alert("Error: Canvas no encontrado.");
      return;
    }
    const ctx = canvas.getContext('2d');

    const catKey = categoryName.toLowerCase();
    const theme = CATEGORY_COLORS[catKey] || CATEGORY_COLORS.custom || { bg: '#6d28d9', text: '#ffffff', border: '#8b5cf6' };
    const topicKey = `topic_${catKey}_title`;
    const isCustom = customDecks.find(d => d.name.toLowerCase() === catKey);
    const categoryDisplayName = isCustom ? `🗂️ ${isCustom.name}` : (TRANSLATIONS[currentLang][topicKey] || categoryName);

    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, 1080, 1080);

    ctx.strokeStyle = theme.text === '#ffffff' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 16;
    ctx.strokeRect(60, 60, 960, 960);

    ctx.fillStyle = theme.text;
    ctx.font = '900 48px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DebateParty', 540, 130);

    ctx.fillStyle = theme.text === '#ffffff' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.15)';
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(180, 165, 720, 56, 28);
    } else {
      ctx.rect(180, 165, 720, 56);
    }
    ctx.fill();

    ctx.fillStyle = theme.text === '#ffffff' ? '#facc15' : theme.text;
    ctx.font = '800 24px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`🏷️ ${categoryDisplayName.toUpperCase()}`, 540, 201);

    ctx.fillStyle = theme.text;
    let fontSize = questionText.length > 130 ? 38 : (questionText.length > 80 ? 44 : 50);
    ctx.font = `900 ${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.textAlign = 'center';
    
    const words = questionText.split(' ');
    let line = '';
    let lines = [];
    let maxWidth = 860;

    for (let i = 0; i < words.length; i++) {
      let testLine = line + words[i] + ' ';
      let metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        lines.push(line);
        line = words[i] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    let lineHeight = fontSize * 1.3;
    let totalTextHeight = lines.length * lineHeight;
    let startY = 280;

    lines.forEach((l, index) => {
      ctx.fillText(l.trim(), 540, startY + (index * lineHeight));
    });

    let pollY = startY + totalTextHeight + 45; 

    if (state.currentVoteResults && state.currentVoteResults.total > 0) {
      const { pctA, pctB } = state.currentVoteResults;
      const labelA = state.currentVoteLabels ? state.currentVoteLabels.a : 'A';
      const labelB = state.currentVoteLabels ? state.currentVoteLabels.b : 'B';

      ctx.fillStyle = theme.text;
      ctx.font = '800 26px -apple-system, BlinkMacSystemFont, sans-serif';

      ctx.textAlign = 'left';
      ctx.fillText(`${labelA}: ${pctA}%`, 120, pollY);
      ctx.textAlign = 'right';
      ctx.fillText(`${labelB}: ${pctB}%`, 960, pollY);

      pollY += 16;
      ctx.fillStyle = theme.text === '#ffffff' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)';
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(120, pollY, 840, 32, 16);
      } else {
        ctx.rect(120, pollY, 840, 32);
      }
      ctx.fill();

      const barWidthA = 840 * (pctA / 100);
      if (barWidthA > 0) {
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(120, pollY, barWidthA, 32, 16);
        } else {
          ctx.rect(120, pollY, barWidthA, 32);
        }
        ctx.fill();
      }

      const barWidthB = 840 * (pctB / 100);
      if (barWidthB > 0) {
        ctx.fillStyle = '#ec4899';
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(120 + barWidthA, pollY, barWidthB, 32, 16);
        } else {
          ctx.rect(120 + barWidthA, pollY, barWidthB, 32);
        }
        ctx.fill();
      }
    }

    ctx.fillStyle = theme.text;
    ctx.globalAlpha = 0.95; 
    ctx.textAlign = 'center';
    ctx.font = '800 32px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('🔥 Entra a debatir en DebateParty', 540, 930);
    
    ctx.globalAlpha = 0.85; 
    ctx.font = '600 22px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('El juego social definitivo para reuniones y cenas', 540, 975);
    ctx.globalAlpha = 1.0;

    canvas.toBlob(async (blob) => {
      if (!blob) {
        alert("Error al generar la imagen.");
        return;
      }
      const file = new File([blob], "debateparty-dilema.png", { type: "image/png" });
      const shareData = {
        title: 'DebateParty - Dilema',
        text: `¡Mira este debate de DebateParty! 💬 "${questionText}"`,
        files: [file]
      };

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share(shareData);
          return;
        } catch (err) {
          if (err.name !== 'AbortError') console.error("Error al compartir:", err);
        }
      }

      const link = document.createElement('a');
      link.download = 'debateparty-dilema.png';
      link.href = canvas.toDataURL('image/png');
      link.click();

      alert(currentLang === 'es' ? "📥 ¡Tarjeta descargada con éxito!" : "📥 Card downloaded successfully!");
    }, 'image/png');

  } catch (err) {
    console.error("❌ Error en generateAndShareCard:", err);
    alert("Hubo un error al generar la tarjeta para compartir.");
  }
}

document.getElementById('share-dilemma-btn').addEventListener('click', () => {
  generateAndShareCard(state.currentQuestionText, state.selectedCategory);
});

document.getElementById('detail-share-btn').addEventListener('click', () => {
  generateAndShareCard(state.detailQuestionText, state.detailCategory);
});

const proposeBtn = document.getElementById('propose-btn');
const proposalOverlay = document.getElementById('proposal-overlay');
const closeProposalModal = document.getElementById('close-proposal-modal');
const sendProposalBtn = document.getElementById('send-proposal-btn');
const proposalCategorySelect = document.getElementById('proposal-category-select');
const proposalModalCard = document.getElementById('proposal-modal-card');

function setupProposalModalTheme() {
  if (!proposalCategorySelect || !proposalModalCard) return;

  const updateModalTheme = () => {
    const selectedCat = proposalCategorySelect.value;
    const theme = CATEGORY_COLORS[selectedCat] || CATEGORY_COLORS.absurd;
    
    proposalModalCard.style.backgroundColor = theme.bg;
    proposalModalCard.style.color = theme.text;
    proposalModalCard.style.borderColor = theme.border;
  };

  proposalCategorySelect.addEventListener('change', updateModalTheme);
  updateModalTheme();
}

if (proposeBtn) {
  proposeBtn.addEventListener('click', () => {
    proposalOverlay.classList.remove('hidden');
    setupProposalModalTheme();
  });
}

if (closeProposalModal) {
  closeProposalModal.addEventListener('click', () => {
    proposalOverlay.classList.add('hidden');
  });
}

if (sendProposalBtn) {
  sendProposalBtn.addEventListener('click', async () => {
    const textInput = document.getElementById('proposal-text-input');
    const questionText = textInput.value.trim();
    const category = proposalCategorySelect.value;

    if (!questionText) {
      alert(TRANSLATIONS[currentLang].proposal_alert_empty);
      return;
    }

    try {
      const collectionName = currentLang === 'es' ? 'question_proposals_es' : 'question_proposals_en';

      await addDoc(collection(db, collectionName), {
        category: category,
        questionText: questionText,
        author: `${state.user.username}#${state.user.tag}`,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      if (!state.stats.proposalsCount) state.stats.proposalsCount = 0;
      state.stats.proposalsCount++;
      saveUserStats();
      checkAndUnlockAchievements();

      textInput.value = '';
      proposalOverlay.classList.add('hidden');
      alert(TRANSLATIONS[currentLang].proposal_alert_success);
    } catch (error) {
      console.error("Error al enviar la propuesta:", error);
      alert(TRANSLATIONS[currentLang].proposal_alert_error);
    }
  });
}