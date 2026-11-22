import { StructuredResultExplanation } from '../types/nafas';

/**
 * 30 Unique, Warm, Plain-Language 6-Part Result Explanations
 * (10 levels × 3 choices = 30 distinct explanations; zero shared copy; zero slide numbers or rule codes)
 */
export const CHOICE_EXPLANATIONS: Record<string, StructuredResultExplanation> = {
  // ===========================================================================
  // A1 — The First Cough (Tariq, Cafeteria — Mild Choking)
  // ===========================================================================
  'a1-c1': {
    verdict: {
      en: 'Right call — his strong cough cleared it',
      ar: 'تصرف سليم — سعاله القوي طرد اللقمة',
    },
    whatHappened: {
      en: 'You asked Tariq if he was choking, kept him calm, and stayed right beside him until his cough pushed the food out.',
      ar: 'سألت طارق بهدوء «هل بتشرق؟» وشجعته يكمل كحة لحد ما اللقمة خرجت لوحدها.',
    },
    why: {
      en: 'A loud cough means air is still moving in and out of the lungs. No hands-on maneuver beats the body’s own strong cough reflex.',
      ar: 'الكحة القوية والصوت الواضح معناهم إن الهوا لسه بيدخل ويخرج، ومفيش حركة يدوية أقوى من الكحة الطبيعية.',
    },
    nextTime: [
      { en: 'Ask "Are you choking?" to check if they can talk.', ar: 'اسأله «أنت بتشرق؟» عشان تتأكد إنه بيقدر يتكلم.' },
      { en: 'Encourage them to keep coughing calmly.', ar: 'شجّعه يكمل كحة وطمّنه بهدوء.' },
      { en: 'Stay close and watch in case the cough goes silent.', ar: 'خليك جنبه وراقبه لو الكحة ضعفت أو سكتت.' },
    ],
    remember: {
      en: 'Strong cough and clear voice? Stay close, encourage coughing, and do not hit the back.',
      ar: 'كحة قوية وصوت مسموع؟ خليك جنبه وشجّعه يكح من غير ضرب على الضهر.',
    },
    afterCare: {
      en: 'Make sure Tariq breathes comfortably for a few minutes and watch for any lingering cough.',
      ar: 'اطمّن إن نفس طارق رجع هادي ومرتاح لبضع دقائق.',
    },
  },

  'a1-c2': {
    verdict: {
      en: 'Water interrupts a strong protective cough',
      ar: 'المية بتقطع الكحة الطبيعية وبتزود الخطر',
    },
    whatHappened: {
      en: 'Tariq tried to take a sip while coughing, which made him sputter harder and interrupted his breathing rhythm.',
      ar: 'طارق حاول يشرب وهو بيكح، فالمية قطعت كحته وزوّدت الشرقة بدل ما تريّحه.',
    },
    why: {
      en: 'Many people reach for a glass of water first out of kindness. But swallowing closes the throat right when the lungs need an open path to cough the food up.',
      ar: 'ناس كتير بتقدم كوباية مية بحسن نية وقت الشرقة، لكن البلع بيقفل الحلق في اللحظة اللي الرئة محتاجة تطرد فيها اللقمة لبره.',
    },
    nextTime: [
      { en: 'Keep liquids away while someone is still coughing.', ar: 'ابعد أي مية أو سوائل طول ما الشخص لسه بيكح.' },
      { en: 'Tell them calmly to keep coughing it out.', ar: 'اطلب منه بهدوء يكمل كحة لحد ما يرتاح.' },
      { en: 'Stay right beside them until breathing is easy.', ar: 'خليك واقف جنبه لحد ما نفسه يرجع طبيعي.' },
    ],
    remember: {
      en: 'Air clears a coughing throat — water only gets in the way.',
      ar: 'الهوا هو اللي بينضف مجرى النفس وقت الكحة، مش المية.',
    },
  },

  'a1-c3': {
    verdict: {
      en: 'Too forceful — his own cough was working',
      ar: 'تدخل مش في وقته — كحته القوية كانت كافية',
    },
    whatHappened: {
      en: 'Squeezing Tariq’s belly startled him in the middle of a strong cough and broke his natural breathing effort.',
      ar: 'الضغط المفاجئ على بطن طارق وهو بيكح بقوة خضّه وربك نفسه الطبيعي.',
    },
    why: {
      en: 'Many people rush to do belly thrusts the second someone coughs. When a person can cough loudly and speak, external thrusts only disrupt their own effective cough.',
      ar: 'كتير مننا بيتسرع ويتدخل بإيده أول ما يشوف حد بيكح، لكن طالما الكحة مسموعة وبيقدر يتكلم، الضغط الخارجي بيعطّل كحته الفعّالة.',
    },
    nextTime: [
      { en: 'Check first if the cough is loud and they can talk.', ar: 'شوف الأول: هل الكحة صوتها قوي وبيقدر يتكلم؟' },
      { en: 'Let their own cough do the work while you stay close.', ar: 'سيب كحته الطبيعية تطرد اللقمة وخليك جنبه.' },
      { en: 'Save back blows and thrusts for silent, severe choking.', ar: 'خلّي ضربات الضهر وضغطات البطن للحالة اللي مفيهاش صوت ولا كحة.' },
    ],
    remember: {
      en: 'If they can cough and talk, your calm presence is the best medicine.',
      ar: 'طول ما بيكح ويتكلم، وجودك الهادي جنبه هو أحسن مساعدة.',
    },
  },

  // ===========================================================================
  // A2 — Silence in the Lab (Tariq, Computer Lab — Severe Choking)
  // ===========================================================================
  'a2-c1': {
    verdict: {
      en: 'Life saved — back blows and thrusts worked',
      ar: 'أنقذت حياته — ضربات الضهر وضغطات البطن نجحت',
    },
    whatHappened: {
      en: 'You called for an ambulance, leaned Tariq forward for firm back blows, and followed with inward-and-upward belly thrusts until the sandwich piece popped out.',
      ar: 'طلبت الإسعاف، سندت صدر طارق وميّلته لقدام مع ضربات ضهر محسوبة ثم ضغطات بطن للداخل ولأعلى لحد ما اللقمة خرجت.',
    },
    why: {
      en: 'Leaning forward lets gravity help the blockage fall out instead of deeper. Back blows send a sharp pressure wave, and inward-upward belly thrusts push trapped lung air up like popping a cork.',
      ar: 'الميل لقدام بيخلي الجاذبية تساعد اللقمة تخرج لبره مش لتحت، وضربات الضهر مع ضغطات البطن لأعلى بتضغط الهوا المحبوس في الرئة فيطرد الانسداد.',
    },
    nextTime: [
      { en: 'Have someone call emergency services right away.', ar: 'اطلب من حد يتصل بالإسعاف فوراً (أو افتح السبيكر).' },
      { en: 'Support the chest, lean forward, and give up to 5 back blows.', ar: 'اسند صدره وميّله لقدام واعمل حتى ٥ ضربات بين لوحي الكتف.' },
      { en: 'Check, then alternate with up to 5 inward-and-upward belly thrusts.', ar: 'افحص، وبدّل مع حتى ٥ ضغطات بطن للداخل وللأعلى فوق السرة.' },
    ],
    remember: {
      en: 'Silent choking needs immediate action: lean forward, up to 5 on the back, up to 5 on the belly.',
      ar: 'الاختناق الصامت محتاج تدخل فوري: ميل لقدام، حتى ٥ على الضهر، وحتى ٥ على البطن.',
    },
    afterCare: {
      en: 'Confirm Tariq is breathing easily, stay with him, and make sure a doctor checks him after belly thrusts.',
      ar: 'تأكد إن نفس طارق رجع طبيعي، خليك معاه، ولازم دكتور يفحصه بعد ضغطات البطن.',
    },
  },

  'a2-c2': {
    verdict: {
      en: 'Water cannot pass a completely blocked throat',
      ar: 'المية مستحيل تعدي ومجرى النفس مسدود بالكامل',
    },
    whatHappened: {
      en: 'Tariq could not swallow the water at all; liquid pooled in his throat while his lips turned bluer and oxygen kept falling.',
      ar: 'طارق مقدرش يبلع المية خالص، والسائل اتجمع فوق الانسداد وشفاهه ازرقّت أكتر مع نزول الأكسجين.',
    },
    why: {
      en: 'Many people instinctively offer water when someone chokes at the table. When the airway is blocked, water has nowhere to go and steals precious seconds needed for physical rescue.',
      ar: 'رد فعل تلقائي عند ناس كتير إنهم يجيبوا مية، لكن لما مجرى الهوا يكون مقفول، المية بتسد الطريق أكتر وبتضيع ثواني غالية جداً.',
    },
    nextTime: [
      { en: 'Never offer water or food when someone cannot speak or cough.', ar: 'ممنوع أي مية أو بلع لما المصاب ميكونش قادر يتكلم أو يكح.' },
      { en: 'Lean them forward immediately and give up to 5 firm back blows.', ar: 'ميّله لقدام فوراً وابدأ بـ حتى ٥ ضربات ضهر بكعب الإيد.' },
      { en: 'Follow with up to 5 inward-and-upward belly thrusts if still blocked.', ar: 'كمّل بـ حتى ٥ ضغطات بطن للداخل وللأعلى لو اللقمة مخرجتش.' },
    ],
    remember: {
      en: 'A silent throat cannot drink — clear the airway with back blows and thrusts.',
      ar: 'المصاب الصامت مش هيقدر يبلع — افتح مجرى الهوا بضربات الضهر وضغطات البطن.',
    },
  },

  'a2-c3': {
    verdict: {
      en: 'Blind fingers pushed the food deeper inside',
      ar: 'إدخال الصوابع بدون رؤية زق اللقمة لجوه أعمق',
    },
    whatHappened: {
      en: 'Reaching fingers into Tariq’s mouth without seeing the food wedged the blockage tighter down his throat.',
      ar: 'لما دخلت صوابعك في بق طارق من غير ما تكون شايف اللقمة، اتزقت لتحت واتحشرت أعمق في الحلق.',
    },
    why: {
      en: 'Many people try to fish the food out with their fingers in a panic. A blind finger sweep acts like a ramrod, pushing an unseen piece deeper into the narrow airway.',
      ar: 'وقت الخضة ناس كتير بتحاول تطلّع اللقمة بصوابعها، لكن المسح الأعمى بيزق الجسم الغريب لجوه زي السدادة ويقفل الحنجرة تماماً.',
    },
    nextTime: [
      { en: 'Never put fingers in the mouth unless you clearly see the object.', ar: 'متدخلش صوابعك في الفم أبداً إلا لو شايف الجسم بعينك بوضوح.' },
      { en: 'Use air pressure from inside: up to 5 back blows while leaning forward.', ar: 'اعتمد على ضغط الهوا من جوه: حتى ٥ ضربات ضهر وهو مايل لقدام.' },
      { en: 'Alternate with up to 5 belly thrusts above the navel.', ar: 'بدّل مع حتى ٥ ضغطات بطن فوق السرة لحد ما اللقمة تخرج.' },
    ],
    remember: {
      en: 'If you cannot see it, never sweep for it — push it out from behind with air.',
      ar: 'لو مش شايفها بعينك متمدش إيدك — اطردها بضغط الهوا من الضهر والبطن.',
    },
  },

  // ===========================================================================
  // A3 — When He Collapses Unresponsive (Tariq — Unresponsive Adult)
  // ===========================================================================
  'a3-c1': {
    verdict: {
      en: 'Right sequence — firm floor, ambulance, and CPR',
      ar: 'ترتيب مضبوط — أرض صلبة، إسعاف، وبدء الإنعاش',
    },
    whatHappened: {
      en: 'You lowered Tariq gently to the floor, made sure the ambulance was on the line, and started chest compressions while checking his mouth only by sight.',
      ar: 'نزّلت طارق بأمان على الأرض، اتأكدت إن الإسعاف على السبيكر، وبدأت إنعاش الصدر مع فحص الفم بالنظر بس.',
    },
    why: {
      en: 'Once a choking person goes limp, standing maneuvers no longer work. Chest compressions on a firm floor pump blood to the brain and build chest pressure that helps loosen the blockage.',
      ar: 'أول ما المصاب يفقد الوعي ويرتخي، حركات الوقوف مبتنفعش؛ ضغطات الإنعاش على أرض صلبة بتوصّل الدم للمخ وبتعمل ضغط في الصدر يزحزح الانسداد.',
    },
    nextTime: [
      { en: 'Guide the person safely onto a firm, flat floor.', ar: 'نزّل المصاب بأمان على أرض صلبة ومستوية واحمِ راسه.' },
      { en: 'Confirm emergency services are called on speakerphone.', ar: 'أكد الاتصال بالإسعاف على السبيكر واطلب جهاز الصدمات.' },
      { en: 'Start CPR according to your training and remove only visible objects.', ar: 'ابدأ الإنعاش حسب تدريبك وشيل أي جسم يظهر بوضوح في الفم بس.' },
    ],
    remember: {
      en: 'Unresponsive and not breathing? Flat firm floor, call ambulance, and start CPR.',
      ar: 'فقد الوعي ومبيتنفسش؟ أرض صلبة فوراً، أكد الإسعاف، وابدأ الإنعاش.',
    },
    afterCare: {
      en: 'Keep following dispatcher instructions and watching his breathing until paramedics take over.',
      ar: 'كمّل مع تعليمات مسعف التليفون وراقب نفسه لحد ما طاقم الإسعاف يستلم.',
    },
  },

  'a3-c2': {
    verdict: {
      en: 'Sitting in a chair delays life-saving CPR',
      ar: 'قعدته على الكرسي بتأخر الإنعاش اللي هينقذ حياته',
    },
    whatHappened: {
      en: 'Propping an unconscious Tariq on a chair left his airway blocked and kept oxygen from reaching his brain while waiting.',
      ar: 'لما قعّدت طارق على كرسي وهو فاقد الوعي، مجرى النفس فضل مقفول والأكسجين موصلش للمخ في أهم دقايق.',
    },
    why: {
      en: 'Many people try to sit a fainted person on a chair to rest. But an unresponsive choking person cannot breathe on their own and needs immediate chest compressions on a flat floor.',
      ar: 'ناس كتير بتحاول تقعّد اللي يغمى عليه على كرسي، لكن فاقد الوعي بسبب الاختناق مبيتنفسش ومحتاج إنعاش فوري على أرض صلبة ومفرودة.',
    },
    nextTime: [
      { en: 'Never prop an unresponsive person upright in a chair.', ar: 'متقعّدش مصاب فاقد الوعي على كرسي أبداً.' },
      { en: 'Lay them flat on their back on the firm floor.', ar: 'فرّده على ضهره فوق أرضية صلبة ومستوية.' },
      { en: 'Make sure the ambulance is called and start CPR right away.', ar: 'تأكد من طلب الإسعاف وابدأ الإنعاش فوراً حسب تدريبك.' },
    ],
    remember: {
      en: 'Chairs are for the conscious — an unresponsive person belongs flat on a firm floor for CPR.',
      ar: 'الكرسي للواعي بس — فاقد الوعي مكانه أرض صلبة ومستوية عشان تبدأ الإنعاش.',
    },
  },

  'a3-c3': {
    verdict: {
      en: 'Blind finger sweep risks wedging the blockage deeper',
      ar: 'المسح الأعمى بالصوابع بيحشر الجسم أعمق في الحلق',
    },
    whatHappened: {
      en: 'Sweeping fingers blindly inside Tariq’s mouth pushed the hidden food piece tighter against his windpipe and delayed chest compressions.',
      ar: 'البحث بالصوابع جوه بق طارق من غير رؤية زق اللقمة المخفية أعمق في مجرى الهوا وأخّر ضغطات الصدر.',
    },
    why: {
      en: 'Many people hope to hook the food out once the person is on the floor. Without seeing it clearly, fingers push the object down instead of pulling it out.',
      ar: 'رد فعل شائع إن المسعف يدور بصوابعه في الفم بعد سقوط المصاب، لكن بدون رؤية واضحة الصوابع بتدفع الجسم لتحت بدل ما تطلعه.',
    },
    nextTime: [
      { en: 'Look into the mouth quickly — never probe blindly with fingers.', ar: 'بص في الفم بعينك بس — وإياك تدور بصوابعك بشكل أعمى.' },
      { en: 'Remove an object only if you can see it clearly.', ar: 'شيل الجسم بس لو بقى ظاهر قدام عينك بوضوح.' },
      { en: 'Start CPR on the firm floor and follow dispatcher guidance.', ar: 'ابدأ الإنعاش على الأرض الصلبة واتبع تعليمات الإسعاف.' },
    ],
    remember: {
      en: 'Look with your eyes, not with your fingers — start CPR on a firm surface.',
      ar: 'افحص الفم بعينك مش بصوابعك — وابدأ الإنعاش فوراً على سطح صلب.',
    },
  },

  // ===========================================================================
  // A4 — When Standard Thrusts Do Not Fit (Salma, Late Pregnancy — Severe)
  // ===========================================================================
  'a4-c1': {
    verdict: {
      en: 'Safe rescue — chest thrusts protected mother and baby',
      ar: 'إنقاذ آمن — ضغطات الصدر حمت الأم والجنين',
    },
    whatHappened: {
      en: 'You called for an ambulance early, gave firm back blows while leaning Salma forward, and used chest thrusts instead of pressing her belly until the food cleared.',
      ar: 'طلبت الإسعاف بدري، ميّلت سلمى لقدام لضربات الضهر، واستخدمت ضغطات الصدر بدل البطن لحد ما اللقمة خرجت بأمان.',
    },
    why: {
      en: 'In late pregnancy or a very large person, there is no safe room above the navel for belly thrusts. Pressing the chest squeezes air from the lungs directly without harming the pregnant belly.',
      ar: 'في آخر الحمل أو مع الشخص الكبير جداً، مبيكونش آمن ولا ممكن نضغط فوق السرة؛ ضغطات الصدر بتطرد الهوا من الرئة مباشرة من غير أي أذى للبطن أو الجنين.',
    },
    nextTime: [
      { en: 'Call emergency services early when a pregnant person chokes.', ar: 'اطلب الإسعاف بدري أول ما تحصل شرقة شديدة لحامل.' },
      { en: 'Lean forward and give up to 5 firm back blows between shoulder blades.', ar: 'ميّلها لقدام واعمل حتى ٥ ضربات ضهر بين لوحي الكتف.' },
      { en: 'Place hands on the chest — never the belly — for up to 5 chest thrusts.', ar: 'حط إيديك على منتصف الصدر — مش البطن — لعمل حتى ٥ ضغطات صدر.' },
    ],
    remember: {
      en: 'Late pregnancy or cannot wrap the belly? Move your hands up to the chest.',
      ar: 'في آخر الحمل أو مش قادر تحوط البطن؟ ارفع إيديك فوراً على الصدر.',
    },
    afterCare: {
      en: 'Keep Salma calm, monitor her breathing, and have a doctor examine both mother and baby right away.',
      ar: 'طمّن سلمى وراقب نفسها، ولازم فحص طبي فوري للاطمئنان عليها وعلى الجنين.',
    },
  },

  'a4-c2': {
    verdict: {
      en: 'Unsafe — never press a late-pregnancy belly',
      ar: 'خطر كبير — ممنوع الضغط على البطن في آخر الحمل',
    },
    whatHappened: {
      en: 'Pressing over Salma’s pregnant abdomen endangered her and the baby while failing to push enough air up to clear her throat.',
      ar: 'الضغط على بطن سلمى في آخر الحمل عرّضها هي والجنين للخطر، ومنجحش في عمل دفعة هوا تطلّع اللقمة.',
    },
    why: {
      en: 'Many people only know standard belly thrusts and try them automatically. In late pregnancy, belly thrusts put direct force on the uterus and cannot reach the diaphragm effectively.',
      ar: 'ناس كتير حافظة حركة ضغط البطن بس وبتعملها تلقائياً، لكن في آخر الحمل الضغط على البطن بيؤذي الرحم ومبيوصلش للحجاب الحاجز صح.',
    },
    nextTime: [
      { en: 'Keep hands completely off the abdomen in late pregnancy.', ar: 'ابعد إيديك تماماً عن منطقة البطن في آخر الحمل.' },
      { en: 'Start with up to 5 back blows while supporting her chest forward.', ar: 'ابدأ بـ حتى ٥ ضربات ضهر وأنت ساند صدرها ومايلها لقدام.' },
      { en: 'Wrap arms under the armpits onto the chest for up to 5 chest thrusts.', ar: 'حط إيديك على عظمة الصدر من تحت الإبط لعمل حتى ٥ ضغطات صدر.' },
    ],
    remember: {
      en: 'Protect the pregnant belly — always switch from belly thrusts to chest thrusts.',
      ar: 'احمِ بطن الحامل دايماً — استبدل ضغطات البطن بضغطات على الصدر.',
    },
  },

  'a4-c3': {
    verdict: {
      en: 'Water cannot pass a silent, blocked airway',
      ar: 'المية مش هتعدي مع اختناق صامت ومجرى مسدود',
    },
    whatHappened: {
      en: 'Salma could not swallow a single drop; the water spilled back as her oxygen dropped further.',
      ar: 'سلمى مقدرتش تبلع نقطة مية واحدة لأن الحلق مقفول، والأكسجين نزل أكتر.',
    },
    why: {
      en: 'Many people offer water hoping it will wash the food down. When no air or sound can pass, water cannot reach the stomach and only delays chest thrusts.',
      ar: 'تقديم المية تصرف شائع بنية المساعدة، لكن لما ميكونش فيه صوت ولا هوا، المية مبتنزلش المعدة وبتعطّل البدء في ضربات الضهر وضغطات الصدر.',
    },
    nextTime: [
      { en: 'Skip water whenever a choking person cannot talk or cough.', ar: 'متقدمش مية خالص لما المصاب ميكونش قادر يتكلم أو يكح.' },
      { en: 'Call for emergency help and give up to 5 firm back blows.', ar: 'اطلب الإسعاف فوراً ونفّذ حتى ٥ ضربات ضهر وهي مايلة لقدام.' },
      { en: 'Follow with up to 5 firm chest thrusts until the airway opens.', ar: 'كمّل بـ حتى ٥ ضغطات على الصدر بالتبادل لحد ما مجرى النفس يتفتح.' },
    ],
    remember: {
      en: 'Silent choking in pregnancy needs back blows and chest thrusts — never water.',
      ar: 'الاختناق الصامت في الحمل علاجه ضربات الضهر وضغطات الصدر، مش المية.',
    },
  },

  // ===========================================================================
  // C1 — Cafeteria Alarm (Youssef, 6 yrs — Severe Child Choking)
  // ===========================================================================
  'c1-c1': {
    verdict: {
      en: 'Great rescue — kneeling to his height made it work',
      ar: 'إنقاذ ممتاز — نزولك لمستوى طوله نجّح الإسعاف',
    },
    whatHappened: {
      en: 'You knelt behind Youssef, leaned him forward for up to 5 back blows, and gave up to 5 child-sized belly thrusts until the food popped out.',
      ar: 'نزلت على ركبتيك ورا يوسف، ميّلته لقدام لعمل ضربات الضهر، وبدّلت مع ضغطات بطن بقوة مناسبة لسنه لحد ما اللقمة خرجت.',
    },
    why: {
      en: 'Kneeling brings your hands to the exact angle of a child’s shoulder blades and belly. That lets you control your force so the air pop clears the throat without hurting smaller ribs.',
      ar: 'النزول على ركبتيك لمستوى طول الطفل بيظبط زاوية إيدك على كتفه وبطنه بالظبط، وبيخليك تتحكم في قوتك عشان تطرد اللقمة بأمان.',
    },
    nextTime: [
      { en: 'Kneel or bend down behind the child to match their height.', ar: 'انزل على ركبتيك ورا الطفل عشان تبقى في مستوى طوله.' },
      { en: 'Call early for help, lean them forward, and give up to 5 back blows.', ar: 'اطلب المساعدة بدري، ميّله لقدام واعمل حتى ٥ ضربات ضهر.' },
      { en: 'Reassess, then give up to 5 inward-and-upward belly thrusts with child force.', ar: 'افحص، وبعدين اعمل حتى ٥ ضغطات بطن للداخل وللأعلى بقوة تناسب الطفل.' },
    ],
    remember: {
      en: 'For a choking child: kneel to their height, up to 5 on the back, up to 5 on the belly.',
      ar: 'مع الطفل المختنق: انزل لطوله، حتى ٥ على الضهر، وحتى ٥ على البطن بقوة مناسبة.',
    },
    afterCare: {
      en: 'Comfort Youssef, watch his breathing closely, and have a doctor check him after belly thrusts.',
      ar: 'طمّن يوسف وراقب تنفسه، وخلي دكتور يفحصه للاطمئنان بعد ضغطات البطن.',
    },
  },

  'c1-c2': {
    verdict: {
      en: 'Water cannot wash down a total airway block',
      ar: 'المية مش هتبلّع لقمة قافلة مجرى النفس',
    },
    whatHappened: {
      en: 'Holding a cup of water to Youssef’s mouth while he was silent only spilled liquid into a blocked throat and wasted vital seconds.',
      ar: 'تقديم المية ليوسف وهو صامت ومش بيتنفس خلاه يشرق أكتر وضيّع ثواني حاسمة كان لازم تتدخل فيها.',
    },
    why: {
      en: 'Many adults rush to give a child water when food gets stuck. When the windpipe is blocked, the child cannot swallow and needs air pushed up from the lungs instead.',
      ar: 'كبار كتير بيجروا يجيبوا مية للطفل أول ما يشرق، لكن لما القصبة الهوائية تكون مسدودة الطفل مبيقدرش يبلع ومحتاج دفعة هوا من الرئة لبره.',
    },
    nextTime: [
      { en: 'Put the water cup away when a child is silent and clutching their neck.', ar: 'ابعد كوباية المية فوراً لو الطفل ماسك رقبته ومفيش صوت.' },
      { en: 'Kneel behind the child, lean them forward, and give up to 5 back blows.', ar: 'انزل على ركبتيك وراه، ميّله لقدام واعمل حتى ٥ ضربات ضهر.' },
      { en: 'Alternate with up to 5 child-sized belly thrusts until clear.', ar: 'بدّل مع حتى ٥ ضغطات بطن بقوة مناسبة للطفل لحد ما يتنفس.' },
    ],
    remember: {
      en: 'Zero sound means zero swallowing — kneel down and clear the airway.',
      ar: 'مفيش صوت يعني مفيش بلع — انزل لمستوى الطفل وافتح مجرى الهوا.',
    },
  },

  'c1-c3': {
    verdict: {
      en: 'Hitting the neck hurts the throat without clearing it',
      ar: 'الضرب العشوائي على الرقبة بيؤذي الحلق ومبيخرجش اللقمة',
    },
    whatHappened: {
      en: 'Slapping Youssef high on the neck while he stood upright shook his throat without building the chest pressure needed to move the blockage.',
      ar: 'الضرب العشوائي على رقبة يوسف وهو واقف مفرود وجع حلقه من غير ما يعمل أي ضغط يطرد اللقمة المحشورة.',
    },
    why: {
      en: 'In a scary moment, people often pat or slap the back of the neck hurriedly. Only firm blows lower down between the shoulder blades—while leaning forward—send a pressure wave through the chest.',
      ar: 'وقت الخوف على الطفل ناس كتير بتخبّط بسرعة على قفاه أو رقبته، لكن المكان الصح هو بين لوحي الكتف مع إمالة الطفل لقدام عشان الضربة تفرغ الهوا لبره.',
    },
    nextTime: [
      { en: 'Never hit the neck or slap the back while the child stands straight up.', ar: 'متضربش على الرقبة أبداً ولا والطفل واقف عمودي.' },
      { en: 'Kneel down, support the chest, and lean the child well forward.', ar: 'انزل لطوله، اسند صدره وميّل جذعه لقدام بوضوح.' },
      { en: 'Aim up to 5 firm blows right between the shoulder blades.', ar: 'وجّه حتى ٥ ضربات بكعب الإيد في النص بين لوحي الكتف.' },
    ],
    remember: {
      en: 'Aim between the shoulder blades while leaning forward — never hit the neck.',
      ar: 'الضربة الصح بين لوحي الكتف والطفل مايل لقدام — مش على الرقبة أبداً.',
    },
  },

  // ===========================================================================
  // C2 — The Unresponsive Child (Youssef, 6 yrs — Unresponsive Child)
  // ===========================================================================
  'c2-c1': {
    verdict: {
      en: 'Spot on — flat floor, ambulance call, and child CPR',
      ar: 'تصرف مظبوط — أرض ثابتة، إسعاف، وإنعاش للطفل',
    },
    whatHappened: {
      en: 'You laid Youssef gently on the floor, made sure the ambulance was called, started CPR, and took the food out only once you saw it clearly.',
      ar: 'نزّلت يوسف برفق على الأرض، أكدت طلب الإسعاف، بدأت الإنعاش، وشيلت اللقمة بس لما ظهرت بوضوح قدام عينك.',
    },
    why: {
      en: 'An unconscious child needs a firm flat surface so chest compressions can circulate blood and squeeze the lungs strongly enough to push the trapped food into view.',
      ar: 'الطفل فاقد الوعي محتاج أرضية صلبة ومفرودة عشان ضغطات الإنعاش تضخ الدم للمخ وتضغط الهوا في الصدر فتزق اللقمة لحد ما تظهر.',
    },
    nextTime: [
      { en: 'Lower the child gently onto their back on a firm flat floor.', ar: 'نزّل الطفل برفق على ضهره فوق أرضية ثابتة ومستوية.' },
      { en: 'Make sure someone calls the ambulance immediately.', ar: 'تأكد من الاتصال بالإسعاف فوراً على السبيكر.' },
      { en: 'Start child CPR according to your training and remove only visible food.', ar: 'ابدأ إنعاش الطفل حسب تدريبك وشيل اللقمة لو ظهرت بعينك بس.' },
    ],
    remember: {
      en: 'When a choking child goes limp: firm floor, call ambulance, and start CPR.',
      ar: 'أول ما الطفل المختنق يفقد الوعي: أرض ثابتة، إسعاف، وابدأ الإنعاش فوراً.',
    },
    afterCare: {
      en: 'Keep Youssef warm and monitored until emergency paramedics arrive and examine him.',
      ar: 'خليك جنب يوسف وراقب تنفسه لحد ما فريق الإسعاف يوصل ويفحصه.',
    },
  },

  'c2-c2': {
    verdict: {
      en: 'Blind finger sweep pushes food deeper in a child',
      ar: 'المسح الأعمى بالصبع بيزق اللقمة أعمق في حلق الطفل',
    },
    whatHappened: {
      en: 'Probing inside Youssef’s mouth without seeing the food jammed the piece tighter into his small airway.',
      ar: 'إدخال صبعك للتدوير في بق يوسف من غير ما تشوف اللقمة زقها لتحت وحشرها أكتر في مجرى نفسه الضيق.',
    },
    why: {
      en: 'Many caregivers try to hook the food out with a finger as soon as a child faints. Because a child’s throat is narrow, a blind finger easily pushes the object down like a cork.',
      ar: 'بدافع الخوف، ناس كتير بتحاول تمد صبعها تطلّع اللقمة، لكن حلق الطفل ضيق جداً وأي مسح أعمى بيزق الجسم الغريب لتحت زي السدادة.',
    },
    nextTime: [
      { en: 'Look into the mouth with your eyes only — never sweep blindly.', ar: 'بص جوه الفم بعينك بس — ومتعملش مسح أعمى بصبعك أبداً.' },
      { en: 'Only pinch out an object if it is clearly visible.', ar: 'شيل الجسم بس لو كنت شايفه بعينك واضح قدامك.' },
      { en: 'Continue child CPR on the firm floor until help arrives.', ar: 'كمّل إنعاش الطفل على الأرض الصلبة لحد ما يتفتح النفس وتوصل الإسعاف.' },
    ],
    remember: {
      en: 'Never fish blindly in a child’s mouth — let CPR push the blockage out.',
      ar: 'متدورش بصبعك في بق الطفل بدون رؤية — ضغطات الإنعاش هي اللي بتزق الانسداد.',
    },
  },

  'c2-c3': {
    verdict: {
      en: 'Standing back blows do not work once unconscious',
      ar: 'ضربات الضهر وهو واقف مبتنفعش بعد فقدان الوعي',
    },
    whatHappened: {
      en: 'Trying to hold a limp Youssef up for back blows wasted precious seconds while his brain and heart needed CPR on the floor.',
      ar: 'محاولة سند يوسف وهو مرتخي وفاقد الوعي عشان تضرب على ضهره ضيّعت ثواني غالية كان لازم يبدأ فيها الإنعاش على الأرض.',
    },
    why: {
      en: 'Many people keep repeating back blows hoping the next one will work. Once a child goes limp, they need chest compressions on a firm flat floor to keep blood flowing.',
      ar: 'ناس كتير بتفضل تكمل ضرب على الضهر على أمل اللقمة تخرج، لكن أول ما الطفل يرتخي ويفقد الوعي لازم ينزل على أرض صلبة عشان الإنعاش يوصّل الدم للمخ.',
    },
    nextTime: [
      { en: 'Stop upright back blows the moment a child becomes limp.', ar: 'وقّف ضربات الضهر وقوفاً في اللحظة اللي الطفل يرتخي فيها.' },
      { en: 'Lay the child flat on a firm surface right away.', ar: 'نزّله فوراً على ضهره فوق سطح صلب ومستوٍ.' },
      { en: 'Confirm the ambulance call and start CPR according to your training.', ar: 'أكد طلب الإسعاف وابدأ الإنعاش حسب تدريبك من غير تأخير.' },
    ],
    remember: {
      en: 'Standing maneuvers are for awake children — limp children need the floor and CPR.',
      ar: 'ضربات الوقوف للطفل الواعي بس — الطفل الفاقد للوعي محتاج أرض صلبة وإنعاش.',
    },
  },

  // ===========================================================================
  // C3 — Cough at Recess (Youssef, 6 yrs — Mild Child Choking)
  // ===========================================================================
  'c3-c1': {
    verdict: {
      en: 'Well done — calm encouragement let him cough it out',
      ar: 'أحسنت — تشجيعك الهادي ساعده يطردها بكحته',
    },
    whatHappened: {
      en: 'You stayed right beside Youssef at recess, reassured him, and let his loud cough clear the snack piece on its own.',
      ar: 'وقفت جنب يوسف في الفسحة وطمّنته بهدوء وشجعته يكح لحد ما قطعة السناك خرجت لوحدها.',
    },
    why: {
      en: 'When a child can cough loudly, talk, or cry, plenty of air is getting past the food. Staying calm prevents panic gasps that could pull the food deeper.',
      ar: 'لما الطفل يكون قادر يكح بصوت عالي ويتكلم أو يبكي، ده معناه إن الهوا شغال كويس؛ هدوءك جنبه بيمنعه يتخض أو يشهق فتدخل اللقمة لجوه.',
    },
    nextTime: [
      { en: 'Kneel near the child and speak in a calm, reassuring voice.', ar: 'قرب من الطفل وطمّنه بصوت هادي عشان ميتخضش.' },
      { en: 'Encourage them to keep coughing until the throat feels clear.', ar: 'شجّعه يكمل كحة لحد ما يحس إن حلقه نضف تماماً.' },
      { en: 'Watch closely in case the cough suddenly becomes quiet or weak.', ar: 'راقبه عن قرب، ولو الكحة سكتت أو ضعفت تدخّل فوراً.' },
    ],
    remember: {
      en: 'Loud cough and clear voice in a child? Stay calm, encourage coughing, and keep watch.',
      ar: 'كحة مسموعة وصوت واضح عند الطفل؟ طمّنه، شجّعه يكح، وراقبه عن قرب.',
    },
    afterCare: {
      en: 'Let Youssef catch his breath quietly before running back to play.',
      ar: 'خلّي يوسف ياخد نفسه ويرتاح شوية قبل ما يرجع يلعب.',
    },
  },

  'c3-c2': {
    verdict: {
      en: 'Unnecessary — belly thrusts scared a coughing child',
      ar: 'تدخل غير لازم — ضغط البطن خض الطفل وقطع كحته',
    },
    whatHappened: {
      en: 'Grabbing Youssef for forceful belly thrusts while he was coughing and talking frightened him and broke his natural cough.',
      ar: 'مسك يوسف وعمل ضغطات بطن قوية وهو بيكح وبيتكلم خوّفه جداً وقطع كحته الطبيعية اللي كانت هتطلّع اللقمة.',
    },
    why: {
      en: 'Many adults panic when a child coughs and jump straight to belly thrusts. Thrusts are strong physical maneuvers reserved only for silent, severe choking.',
      ar: 'خوف الكبار على الطفل بيخليهم يتسرعوا بضغطات البطن مع أول كحة، لكن ضغطات البطن حركة قوية مخصصة بس للاختناق الشديد اللي مفيهوش صوت.',
    },
    nextTime: [
      { en: 'Listen first: can the child cough loudly, cry, or talk?', ar: 'اسمع الأول: هل الطفل بيكح بصوت مسموع أو بيتكلم ويبكي؟' },
      { en: 'Keep your hands gentle and encourage them to cough it out.', ar: 'متضغطش على بطنه، وطمّنه يكمل كحة لوحده.' },
      { en: 'Intervene with back blows and thrusts only if the cough goes silent.', ar: 'تدخّل بضربات الضهر والبطن بس لو الكحة ضعفت أو الصوت اختفى.' },
    ],
    remember: {
      en: 'Never squeeze a child who is coughing strongly — let their cough work.',
      ar: 'متضغطش على بطن طفل بيكح بقوة — سيب كحته الطبيعية تقوم بدورها.',
    },
  },

  'c3-c3': {
    verdict: {
      en: 'Water interrupts the child’s natural cough reflex',
      ar: 'المية بتقطع كحة الطفل وممكن تزود الشرقة',
    },
    whatHappened: {
      en: 'Trying to make Youssef drink water while coughing made him gag harder and interrupted his steady breathing.',
      ar: 'محاولة شرب يوسف للمية وهو بيكح خلته يشرق بزيادة وعطّلت اندفاع الهوا اللي كان بيطرد اللقمة.',
    },
    why: {
      en: 'Many parents offer a water bottle right away at recess. Swallowing water forces the airway valve to close right when the child needs to cough air upward.',
      ar: 'أهالي كتير بتقدم إزازة المية فوراً وقت الشرقة، لكن بلع المية بيقفل صمام الحلق في نفس اللحظة اللي الهوا محتاج يخرج فيها بقوة.',
    },
    nextTime: [
      { en: 'Hold off on water until the coughing stops completely.', ar: 'أجّل شرب المية خالص لحد ما الكحة تخلص والنفس يهدى.' },
      { en: 'Encourage the child to keep coughing freely.', ar: 'شجّع الطفل يكح بحرية وهو واقف أو قاعد مرتاح.' },
      { en: 'Stay right next to them until they breathe easily.', ar: 'خليك واقف جنبه وراقبه لحد ما نفسه يرجع طبيعي.' },
    ],
    remember: {
      en: 'Wait on the water — let a coughing child clear their throat with air first.',
      ar: 'اصبر على المية — سيب الطفل ينضف حلقه بالكحة الأول.',
    },
  },

  // ===========================================================================
  // I1 — Silence in the Nursery (Layan, 8 mos — Severe Infant Choking)
  // ===========================================================================
  'i1-c1': {
    verdict: {
      en: 'Safe infant rescue — back blows and chest thrusts worked',
      ar: 'إنقاذ آمن للرضيعة — ضربات الضهر وضغطات الصدر نجحت',
    },
    whatHappened: {
      en: 'You supported Layan face-down on your forearm for up to 5 back blows, turned her onto her back for up to 5 two-finger chest thrusts, and the piece popped out as she cried.',
      ar: 'سندت رأس وفك ليان على ساعدك لعمل حتى ٥ ضربات ضهر، وبعدين قلبتها بأمان لعمل حتى ٥ ضغطات صدر بإصبعين لحد ما الجسم خرج وبكت.',
    },
    why: {
      en: 'Supporting the baby tilted downward lets gravity assist the back blows. Two-finger chest thrusts push air from the lungs safely without pressing a baby’s delicate belly organs.',
      ar: 'سند الرضيعة على الساعد بيساعد الجاذبية تطلّع الجسم مع ضربات الضهر، وضغطات الصدر بإصبعين بتضغط الهوا بأمان من غير ما نلمس أعضاء بطن الرضيع الحساسة.',
    },
    nextTime: [
      { en: 'Call for help and support the infant face-down along your forearm.', ar: 'اطلب المساعدة واسند الرضيع على ساعدك ووشه لتحت مع دعم الفك.' },
      { en: 'Give up to 5 controlled back blows between the shoulder blades.', ar: 'اعمل حتى ٥ ضربات ضهر محسوبة بكعب الإيد بين لوحي الكتف.' },
      { en: 'Turn onto the back and give up to 5 two-finger chest thrusts — never belly thrusts.', ar: 'اقلبه على ضهره واعمل حتى ٥ ضغطات صدر بإصبعين — وإياك تضغط على البطن.' },
    ],
    remember: {
      en: 'For babies under 1 year: back blows and chest thrusts with two fingers — never the belly.',
      ar: 'للرضيع أقل من سنة: ضربات ضهر وضغطات صدر بإصبعين — وممنوع لمس البطن نهائياً.',
    },
    afterCare: {
      en: 'Hold Layan calmly, watch her breathing, and have a doctor examine her after choking rescue.',
      ar: 'طبطب على ليان وراقب نفسها، واعرضها على دكتور للاطمئنان بعد الإنقاذ.',
    },
  },

  'i1-c2': {
    verdict: {
      en: 'Dangerous — never press an infant’s belly',
      ar: 'خطر شديد — ممنوع ضغطات البطن للرضيع نهائياً',
    },
    whatHappened: {
      en: 'Pressing on 8-month-old Layan’s soft belly risked injuring her liver and internal organs instead of safely clearing her airway.',
      ar: 'الضغط على بطن ليان (٨ شهور) عرّض كبدها وأعضاءها الداخلية لإصابة خطيرة بدل ما يفتح مجرى النفس بأمان.',
    },
    why: {
      en: 'Many people assume the adult belly-thrust move works for everyone. In infants under one year, the liver sits unprotected under soft ribs and can be badly hurt by belly pressure.',
      ar: 'ناس كتير بتفتكر إن ضغط البطن بتاع الكبار ينفع لكل الأعمار، لكن الرضيع أقل من سنة أعضاؤه الداخلية وخصوصاً الكبد حساسة جداً وتتصاب من ضغط البطن.',
    },
    nextTime: [
      { en: 'Never perform abdominal thrusts on an infant under 1 year old.', ar: 'ممنوع منعاً باتاً عمل ضغطات بطن لأي رضيع أقل من سنة.' },
      { en: 'Support the baby face-down on your forearm for up to 5 back blows.', ar: 'اسند الرضيع على ساعدك واعمل حتى ٥ ضربات ضهر بين الكتفين.' },
      { en: 'Flip onto the back and use two fingers on the chest for up to 5 chest thrusts.', ar: 'اقلبه على ضهره واستخدم صبعين بس في نص الصدر لعمل حتى ٥ ضغطات صدر.' },
    ],
    remember: {
      en: 'Babies get two-finger chest thrusts — keep your hands off an infant’s belly.',
      ar: 'الرضيع بيتعمله ضغطات صدر بإصبعين بس — ابعد عن بطن الرضيع دايماً.',
    },
  },

  'i1-c3': {
    verdict: {
      en: 'Blind finger sweep pushes the object deeper in a baby',
      ar: 'المسح الأعمى بالصبع بيزق الجسم أعمق في حلق الرضيعة',
    },
    whatHappened: {
      en: 'Putting an adult finger blindly into Layan’s tiny mouth pushed the small toy piece deeper into her throat.',
      ar: 'إدخال صبعك في بق ليان الصغير من غير ما تكون شايف الجسم زق القطعة لجوه وقفل مجرى الهوا أكتر.',
    },
    why: {
      en: 'In a panic, a caregiver’s first instinct is often to reach into the baby’s mouth. An adult finger fills a baby’s small throat and easily rams an unseen object tightly into the windpipe.',
      ar: 'وقت الخوف أول حاجة بتيجي في بال الأهل هي فتح بق الرضيع بالصبع، لكن حلق الرضيع صغير جداً وصبع الكبير بيزق الجسم المخفي لجوه الحنجرة.',
    },
    nextTime: [
      { en: 'Never put your finger in a baby’s mouth unless you clearly see the object.', ar: 'متدخلش صبعك في بق الرضيع أبداً إلا لو شايف الجسم بعينك بوضوح.' },
      { en: 'Support the infant on your forearm for up to 5 back blows.', ar: 'اسند الرضيعة على ساعدك واعمل حتى ٥ ضربات ضهر محسوبة.' },
      { en: 'Alternate with up to 5 two-finger chest thrusts until it pops out.', ar: 'بدّل مع حتى ٥ ضغطات صدر بإصبعين لحد ما الجسم يخرج لبره.' },
    ],
    remember: {
      en: 'Never sweep a baby’s mouth blindly — use forearm back blows and two-finger chest thrusts.',
      ar: 'بلاش مسح أعمى في فم الرضيع — استخدم ضربات الضهر على الساعد وضغطات الصدر بإصبعين.',
    },
  },

  // ===========================================================================
  // I2 — Layan Limp in Your Arms (Layan, 8 mos — Unresponsive Infant)
  // ===========================================================================
  'i2-c1': {
    verdict: {
      en: 'Right action — firm surface, ambulance, and infant CPR',
      ar: 'تصرف سليم — سطح ثابت، إسعاف، وإنعاش للرضيعة',
    },
    whatHappened: {
      en: 'You placed Layan on a firm padded table, confirmed the ambulance call on speaker, started infant CPR, and removed the piece only when you saw it clearly.',
      ar: 'حطيت ليان على سطح ثابت وآمن، أكدت طلب الإسعاف على السبيكر، وبدأت إنعاش الرضيع وشيلت الجسم بس لما ظهر بوضوح.',
    },
    why: {
      en: 'When an infant goes limp, they need a firm flat surface right away so gentle chest compressions can keep oxygen moving to the brain and push the blockage loose.',
      ar: 'لما الرضيع يفقد الوعي ويرتخي، لازم يتحط فوراً على سطح ثابت ومفرود عشان ضغطات الإنعاش توصّل الأكسجين للمخ وتساعد في زحزحة الجسم العالق.',
    },
    nextTime: [
      { en: 'Lay the unresponsive infant flat on a firm, safe surface.', ar: 'حط الرضيع الفاقد للوعي على ضهره فوق سطح ثابت ومستوٍ.' },
      { en: 'Make sure emergency services are called on speakerphone.', ar: 'تأكد من الاتصال بالإسعاف فوراً على مكبر الصوت.' },
      { en: 'Start infant CPR according to your training and remove only visible objects.', ar: 'ابدأ إنعاش الرضيع حسب تدريبك وشيل الجسم لو ظهر قدام عينك بس.' },
    ],
    remember: {
      en: 'Limp, unresponsive baby? Firm surface, call ambulance, and start infant CPR.',
      ar: 'رضيع مرتخي ومبيستجيبش؟ سطح ثابت فوراً، إسعاف، وابدأ إنعاش الرضيع.',
    },
    afterCare: {
      en: 'Keep Layan warm and closely watched until paramedics arrive to take over care.',
      ar: 'حافظ على دفا ليان وراقب نفسها لحظة بلحظة لحد ما الإسعاف يستلمها.',
    },
  },

  'i2-c2': {
    verdict: {
      en: 'Blind finger sweep jams the blockage in a baby’s throat',
      ar: 'المسح الأعمى بالصبع بيحشر الجسم في حنجرة الرضيعة',
    },
    whatHappened: {
      en: 'Searching blindly with your finger inside unconscious Layan’s mouth pushed the unseen object deeper and delayed CPR.',
      ar: 'التدوير بالصبع جوه بق ليان وهي فاقدة الوعي من غير رؤية واضحة زق الجسم الغريب أعمق وعطّل بدء الإنعاش.',
    },
    why: {
      en: 'Many caregivers desperately try to scoop the object out when a baby goes limp. Without seeing it, a finger pushes the blockage straight down into the tiny windpipe.',
      ar: 'مع خوف الأهل لما الرضيع يرتخي بيحاولوا يمدوا صبعهم يطلعوا أي حاجة، لكن بدون رؤية واضحة الصبع بيدفع الجسم ليسد القصبة الهوائية بالكامل.',
    },
    nextTime: [
      { en: 'Look into the baby’s mouth first — never sweep blindly with a finger.', ar: 'بص في بق الرضيع بعينك الأول — وإياك تعمل مسح أعمى بصبعك.' },
      { en: 'Only remove an object if you can clearly see it.', ar: 'شيل الجسم بس في حالة إنك شايفه واضح قدام عينك.' },
      { en: 'Start infant CPR on a firm surface right away.', ar: 'ابدأ إنعاش الرضيع على السطح الثابت فوراً بدون تأخير.' },
    ],
    remember: {
      en: 'Eyes only in a baby’s mouth — if you cannot see it, start infant CPR.',
      ar: 'الفحص بالعين بس في فم الرضيع — لو مش شايف الجسم ابدأ الإنعاش فوراً.',
    },
  },

  'i2-c3': {
    verdict: {
      en: 'Critical delay — an unconscious baby will not wake up alone',
      ar: 'تأخير خطير جداً — الرضيع الفاقد للوعي مش هيفوق لوحده',
    },
    whatHappened: {
      en: 'Waiting and watching while Layan lay limp meant zero oxygen reached her lungs or brain during the most critical seconds.',
      ar: 'الانتظار جنب ليان وهي مرتخية ومبتتنفسش حرم مخها ورئتها من الأكسجين في أخطر ثواني.',
    },
    why: {
      en: 'Sometimes people freeze or hope a baby simply fainted and will wake up in a moment. An unresponsive choking infant has no air flow and needs immediate CPR.',
      ar: 'أحياناً الصدمة بتخلي الشخص يتجمد أو يتمنى إن الرضيع هيفوق لوحده، لكن فقدان الوعي مع الاختناق معناه توقف الهوا تماماً ولازم إنعاش فوري.',
    },
    nextTime: [
      { en: 'Never wait when an infant is limp and not breathing.', ar: 'متنتظرش ولا ثانية لما يكون الرضيع مرتخي ومبيتنفسش.' },
      { en: 'Call emergency services immediately on speakerphone.', ar: 'اطلب الإسعاف فوراً وافتح السبيكر جنبك.' },
      { en: 'Place the baby on a firm surface and start infant CPR right away.', ar: 'حط الرضيع على سطح ثابت وابدأ الإنعاش فوراً حسب تدريبك.' },
    ],
    remember: {
      en: 'Every second counts for a limp baby — call the ambulance and start CPR now.',
      ar: 'كل ثانية بتفرق في حياة الرضيع — اطلب الإسعاف وابدأ الإنعاش حالاً.',
    },
  },

  // ===========================================================================
  // I3 — Strong Cough in the High Chair (Layan, 8 mos — Mild Infant Choking)
  // ===========================================================================
  'i3-c1': {
    verdict: {
      en: 'Wise choice — her loud cough and cry cleared it safely',
      ar: 'تصرف حكيم — كحتها وبكاؤها القوي طردوا اللقمة بأمان',
    },
    whatHappened: {
      en: 'You stayed right beside Layan’s high chair, watched her closely, and let her strong cough clear the soft food bit naturally.',
      ar: 'فضلت واقف جنب الكرسي العالي بتاع ليان وراقبتها بهدوء، لحد ما كحتها القوية طردت اللقمة ورجعت تتنفس براحة.',
    },
    why: {
      en: 'A loud cough and strong cry mean the baby’s airway is open enough to move air fast. Watching closely without shaking or hitting lets her own cough reflex finish the job.',
      ar: 'الكحة المسموعة والبكاء القوي عند الرضيع معناهم إن الهوا بيمر كويس جداً؛ مراقبتك الهادية من غير خبط أو هز بتدي فرصة لكحتها الطبيعية تنضف حلقها.',
    },
    nextTime: [
      { en: 'Check that the baby’s cough and cry are loud and her color is pink.', ar: 'اتأكد إن كحة الرضيع وبكاءه صوتهم واضح وإن لون وشه وردي طبيعي.' },
      { en: 'Stay right beside her and let her cough without interference.', ar: 'خليك جنبه وراقبه عن قرب وسيبه يكح من غير تدخل عنيف.' },
      { en: 'Be ready to start forearm back blows and chest thrusts if she goes silent.', ar: 'خلي إيدك جاهزة للتدخل فوراً لو الكحة ضعفت أو الصوت سكت.' },
    ],
    remember: {
      en: 'Loud cough and strong cry in a baby? Stay close, watch every breath, and stay ready.',
      ar: 'كحة مسموعة وبكاء قوي عند الرضيع؟ خليك جنبه، راقب كل نفس، وكن مستعد.',
    },
    afterCare: {
      en: 'Give Layan a calm break from eating and watch that her breathing stays quiet and easy.',
      ar: 'وقّف الأكل شوية وطمّن ليان لحد ما تتأكد إن نفسها هادي ومرتاح.',
    },
  },

  'i3-c2': {
    verdict: {
      en: 'Never press a baby’s belly — especially during a strong cough',
      ar: 'ممنوع ضغط بطن الرضيع نهائياً — وخصوصاً وهو بيكح بقوة',
    },
    whatHappened: {
      en: 'Pressing on Layan’s belly endangered her fragile internal organs when her own loud cough was already clearing the food.',
      ar: 'الضغط على بطن ليان عرّض أعضاءها الداخلية للخطر في وقت كانت كحتها الطبيعية أصلاً قادرة تطرد اللقمة.',
    },
    why: {
      en: 'Many people panic when a baby sputters at mealtime. Not only does a loudly coughing baby need no thrusts at all, abdominal thrusts are strictly unsafe for infants under one year.',
      ar: 'خوف الأهل وقت شرقة الأكل مفهوم، لكن أولاً الرضيع اللي بيكح بصوت عالي مش محتاج ضغط خارجي، وثانياً ضغط البطن ممنوع تماماً للرضّع في كل الأحوال.',
    },
    nextTime: [
      { en: 'Never perform abdominal thrusts on an infant at any time.', ar: 'متعملش ضغطات بطن للرضيع أبداً تحت أي ظرف.' },
      { en: 'When the cough and cry are loud, stay close and watch without hitting.', ar: 'طالما الكحة والبكاء صوتهم قوي، خليك جنبه وراقبه بهدوء.' },
      { en: 'If the cough turns silent, use forearm back blows and two-finger chest thrusts.', ar: 'لو الصوت سكت أو الكحة ضعفت، استخدم ضربات الضهر على الساعد وضغطات الصدر بإصبعين.' },
    ],
    remember: {
      en: 'No belly thrusts for babies ever — and no hits while a baby is coughing strongly.',
      ar: 'مفيش ضغط بطن للرضيع أبداً — ومفيش ضرب طول ما الرضيع بيكح بقوة.',
    },
  },

  'i3-c3': {
    verdict: {
      en: 'Blind finger sweep can turn a mild gag into total choking',
      ar: 'المسح الأعمى بالصبع ممكن يحوّل الشرقة البسيطة لانسداد كامل',
    },
    whatHappened: {
      en: 'Reaching a finger into Layan’s mouth while she was coughing pushed the loose food bit down toward her windpipe.',
      ar: 'مد صبعك في بق ليان وهي بتكح زق اللقمة اللي كانت على وشك تخرج ودخلها لتحت ناحية القصبة الهوائية.',
    },
    why: {
      en: 'Many parents try to scoop food out of a coughing baby’s mouth right away. A finger easily pushes the piece past the throat valve and turns a mild cough into a silent blockage.',
      ar: 'أمهات وآباء كتير بيحاولوا يلحقوا اللقمة بصبعهم من بق الرضيع، لكن الصبع بيزق اللقمة بسهولة لجوه الحلق ويحوّل الكحة البسيطة لاختناق شديد.',
    },
    nextTime: [
      { en: 'Keep your fingers out of a coughing baby’s mouth.', ar: 'ابعد صوابعك عن فم الرضيع طول ما هو بيكح.' },
      { en: 'Let the baby’s own strong cough push the food forward.', ar: 'سيب كحة الرضيع القوية تطرد اللقمة لبره لوحدها.' },
      { en: 'Stay right beside the high chair ready to act if the cough goes silent.', ar: 'خليك واقف جنب الكرسي العالي ومستعد لو الصوت سكت.' },
    ],
    remember: {
      en: 'Do not poke a coughing baby’s mouth — let the cough push the food out.',
      ar: 'متمدش صبعك في بق رضيع بيكح — سيب كحته تطرد اللقمة بأمان.',
    },
  },
};

export function getChoiceExplanation(choiceId: string): StructuredResultExplanation | undefined {
  return CHOICE_EXPLANATIONS[choiceId];
}
