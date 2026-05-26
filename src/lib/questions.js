// Section A: DISC (1-24)
const discQuestions = [
  { id: 1, text: "I enjoy taking charge and making decisions quickly.", category: "DISC", subcategory: "D", section: "A" },
  { id: 2, text: "I am direct and to the point in conversations.", category: "DISC", subcategory: "D", section: "A" },
  { id: 3, text: "I thrive in competitive environments.", category: "DISC", subcategory: "D", section: "A" },
  { id: 4, text: "I prefer results over processes.", category: "DISC", subcategory: "D", section: "A" },
  { id: 5, text: "I am comfortable taking risks.", category: "DISC", subcategory: "D", section: "A" },
  { id: 6, text: "I challenge the status quo regularly.", category: "DISC", subcategory: "D", section: "A" },
  { id: 7, text: "I enjoy socializing and meeting new people.", category: "DISC", subcategory: "I", section: "A" },
  { id: 8, text: "I am enthusiastic and optimistic.", category: "DISC", subcategory: "I", section: "A" },
  { id: 9, text: "I like to inspire and motivate others.", category: "DISC", subcategory: "I", section: "A" },
  { id: 10, text: "I express my feelings openly.", category: "DISC", subcategory: "I", section: "A" },
  { id: 11, text: "I am good at persuading people.", category: "DISC", subcategory: "I", section: "A" },
  { id: 12, text: "I enjoy being the center of attention.", category: "DISC", subcategory: "I", section: "A" },
  { id: 13, text: "I prefer a stable and predictable environment.", category: "DISC", subcategory: "S", section: "A" },
  { id: 14, text: "I am patient and a good listener.", category: "DISC", subcategory: "S", section: "A" },
  { id: 15, text: "I value loyalty and consistency.", category: "DISC", subcategory: "S", section: "A" },
  { id: 16, text: "I am supportive and cooperative in teams.", category: "DISC", subcategory: "S", section: "A" },
  { id: 17, text: "I prefer working behind the scenes.", category: "DISC", subcategory: "S", section: "A" },
  { id: 18, text: "I resist sudden changes in my environment.", category: "DISC", subcategory: "S", section: "A" },
  { id: 19, text: "I pay close attention to details and accuracy.", category: "DISC", subcategory: "C", section: "A" },
  { id: 20, text: "I follow rules and procedures carefully.", category: "DISC", subcategory: "C", section: "A" },
  { id: 21, text: "I prefer to analyze data before making decisions.", category: "DISC", subcategory: "C", section: "A" },
  { id: 22, text: "I maintain high standards in my work.", category: "DISC", subcategory: "C", section: "A" },
  { id: 23, text: "I am systematic and organized.", category: "DISC", subcategory: "C", section: "A" },
  { id: 24, text: "I prefer quality over speed.", category: "DISC", subcategory: "C", section: "A" },
];

// Section B: MBTI (25-64)
const mbtiQuestions = [
  // E vs I (25-34)
  { id: 25, text: "I feel energized after spending time with groups of people.", category: "MBTI", subcategory: "E", section: "B" },
  { id: 26, text: "I prefer to think out loud rather than internally.", category: "MBTI", subcategory: "E", section: "B" },
  { id: 27, text: "I enjoy being around many people at social events.", category: "MBTI", subcategory: "E", section: "B" },
  { id: 28, text: "I find it easy to start conversations with strangers.", category: "MBTI", subcategory: "E", section: "B" },
  { id: 29, text: "I prefer action over contemplation.", category: "MBTI", subcategory: "E", section: "B" },
  { id: 30, text: "I need quiet time alone to recharge after social interactions.", category: "MBTI", subcategory: "I", section: "B" },
  { id: 31, text: "I prefer one-on-one conversations to group discussions.", category: "MBTI", subcategory: "I", section: "B" },
  { id: 32, text: "I process my thoughts internally before speaking.", category: "MBTI", subcategory: "I", section: "B" },
  { id: 33, text: "I enjoy deep reflection and solitude.", category: "MBTI", subcategory: "I", section: "B" },
  { id: 34, text: "I prefer to observe before participating.", category: "MBTI", subcategory: "I", section: "B" },
  // S vs N (35-44)
  { id: 35, text: "I focus on facts and concrete details.", category: "MBTI", subcategory: "S", section: "B" },
  { id: 36, text: "I trust direct experience over theoretical ideas.", category: "MBTI", subcategory: "S", section: "B" },
  { id: 37, text: "I prefer practical solutions to abstract concepts.", category: "MBTI", subcategory: "S", section: "B" },
  { id: 38, text: "I pay attention to the present moment.", category: "MBTI", subcategory: "S", section: "B" },
  { id: 39, text: "I learn best through hands-on experience.", category: "MBTI", subcategory: "S", section: "B" },
  { id: 40, text: "I enjoy exploring new ideas and possibilities.", category: "MBTI", subcategory: "N", section: "B" },
  { id: 41, text: "I often think about future possibilities.", category: "MBTI", subcategory: "N", section: "B" },
  { id: 42, text: "I see patterns and connections others might miss.", category: "MBTI", subcategory: "N", section: "B" },
  { id: 43, text: "I am drawn to innovative and creative approaches.", category: "MBTI", subcategory: "N", section: "B" },
  { id: 44, text: "I prefer to focus on the big picture over details.", category: "MBTI", subcategory: "N", section: "B" },
  // T vs F (45-54)
  { id: 45, text: "I make decisions based on logic and analysis.", category: "MBTI", subcategory: "T", section: "B" },
  { id: 46, text: "I value fairness and objectivity.", category: "MBTI", subcategory: "T", section: "B" },
  { id: 47, text: "I prefer honest feedback even if it's uncomfortable.", category: "MBTI", subcategory: "T", section: "B" },
  { id: 48, text: "I focus on what makes sense rather than what feels right.", category: "MBTI", subcategory: "T", section: "B" },
  { id: 49, text: "I can detach emotionally when analyzing problems.", category: "MBTI", subcategory: "T", section: "B" },
  { id: 50, text: "I consider how decisions affect people's feelings.", category: "MBTI", subcategory: "F", section: "B" },
  { id: 51, text: "I value harmony and avoiding conflict.", category: "MBTI", subcategory: "F", section: "B" },
  { id: 52, text: "I am empathetic and sensitive to others' needs.", category: "MBTI", subcategory: "F", section: "B" },
  { id: 53, text: "I make decisions based on my personal values.", category: "MBTI", subcategory: "F", section: "B" },
  { id: 54, text: "I prioritize people's well-being over efficiency.", category: "MBTI", subcategory: "F", section: "B" },
  // J vs P (55-64)
  { id: 55, text: "I like to plan ahead and follow schedules.", category: "MBTI", subcategory: "J", section: "B" },
  { id: 56, text: "I prefer structure and organization in my life.", category: "MBTI", subcategory: "J", section: "B" },
  { id: 57, text: "I like to finish tasks before starting new ones.", category: "MBTI", subcategory: "J", section: "B" },
  { id: 58, text: "I feel satisfied when I complete a to-do list.", category: "MBTI", subcategory: "J", section: "B" },
  { id: 59, text: "I prefer to have things decided and settled.", category: "MBTI", subcategory: "J", section: "B" },
  { id: 60, text: "I enjoy going with the flow and being spontaneous.", category: "MBTI", subcategory: "P", section: "B" },
  { id: 61, text: "I like to keep my options open.", category: "MBTI", subcategory: "P", section: "B" },
  { id: 62, text: "I adapt easily to changing situations.", category: "MBTI", subcategory: "P", section: "B" },
  { id: 63, text: "I prefer flexibility over rigid schedules.", category: "MBTI", subcategory: "P", section: "B" },
  { id: 64, text: "I tend to procrastinate but work well under pressure.", category: "MBTI", subcategory: "P", section: "B" },
];

// Section C: Multiple Intelligence (65-104)
const intelligenceQuestions = [
  // Linguistic (65-69)
  { id: 65, text: "I enjoy reading books and writing stories.", category: "Intelligence", subcategory: "Linguistic", section: "C" },
  { id: 66, text: "I find it easy to express myself through words.", category: "Intelligence", subcategory: "Linguistic", section: "C" },
  { id: 67, text: "I enjoy word games, crosswords, and puzzles.", category: "Intelligence", subcategory: "Linguistic", section: "C" },
  { id: 68, text: "I can explain complex ideas clearly to others.", category: "Intelligence", subcategory: "Linguistic", section: "C" },
  { id: 69, text: "I enjoy learning new languages.", category: "Intelligence", subcategory: "Linguistic", section: "C" },
  // Logical-Mathematical (70-74)
  { id: 70, text: "I enjoy solving mathematical problems.", category: "Intelligence", subcategory: "Logical", section: "C" },
  { id: 71, text: "I like to analyze data and find patterns.", category: "Intelligence", subcategory: "Logical", section: "C" },
  { id: 72, text: "I enjoy strategy games and logical puzzles.", category: "Intelligence", subcategory: "Logical", section: "C" },
  { id: 73, text: "I think in terms of cause and effect.", category: "Intelligence", subcategory: "Logical", section: "C" },
  { id: 74, text: "I prefer systematic approaches to problem-solving.", category: "Intelligence", subcategory: "Logical", section: "C" },
  // Musical (75-79)
  { id: 75, text: "I can easily recognize musical patterns and rhythms.", category: "Intelligence", subcategory: "Musical", section: "C" },
  { id: 76, text: "I enjoy singing or playing musical instruments.", category: "Intelligence", subcategory: "Musical", section: "C" },
  { id: 77, text: "Music affects my mood significantly.", category: "Intelligence", subcategory: "Musical", section: "C" },
  { id: 78, text: "I can remember melodies easily.", category: "Intelligence", subcategory: "Musical", section: "C" },
  { id: 79, text: "I often tap or hum while working.", category: "Intelligence", subcategory: "Musical", section: "C" },
  // Spatial (80-84)
  { id: 80, text: "I can visualize objects from different angles.", category: "Intelligence", subcategory: "Spatial", section: "C" },
  { id: 81, text: "I enjoy drawing, painting, or design.", category: "Intelligence", subcategory: "Spatial", section: "C" },
  { id: 82, text: "I have a good sense of direction.", category: "Intelligence", subcategory: "Spatial", section: "C" },
  { id: 83, text: "I enjoy puzzles that involve visual-spatial skills.", category: "Intelligence", subcategory: "Spatial", section: "C" },
  { id: 84, text: "I prefer maps and diagrams over written instructions.", category: "Intelligence", subcategory: "Spatial", section: "C" },
  // Bodily-Kinesthetic (85-89)
  { id: 85, text: "I learn best by doing things physically.", category: "Intelligence", subcategory: "Kinesthetic", section: "C" },
  { id: 86, text: "I enjoy sports and physical activities.", category: "Intelligence", subcategory: "Kinesthetic", section: "C" },
  { id: 87, text: "I am good at working with my hands.", category: "Intelligence", subcategory: "Kinesthetic", section: "C" },
  { id: 88, text: "I find it hard to sit still for long periods.", category: "Intelligence", subcategory: "Kinesthetic", section: "C" },
  { id: 89, text: "I express ideas through body movement.", category: "Intelligence", subcategory: "Kinesthetic", section: "C" },
  // Interpersonal (90-94)
  { id: 90, text: "I understand other people's feelings easily.", category: "Intelligence", subcategory: "Interpersonal", section: "C" },
  { id: 91, text: "I enjoy working in teams and groups.", category: "Intelligence", subcategory: "Interpersonal", section: "C" },
  { id: 92, text: "People often come to me for advice.", category: "Intelligence", subcategory: "Interpersonal", section: "C" },
  { id: 93, text: "I can resolve conflicts between others.", category: "Intelligence", subcategory: "Interpersonal", section: "C" },
  { id: 94, text: "I enjoy mentoring and teaching others.", category: "Intelligence", subcategory: "Interpersonal", section: "C" },
  // Intrapersonal (95-99)
  { id: 95, text: "I understand my own strengths and weaknesses.", category: "Intelligence", subcategory: "Intrapersonal", section: "C" },
  { id: 96, text: "I enjoy spending time in self-reflection.", category: "Intelligence", subcategory: "Intrapersonal", section: "C" },
  { id: 97, text: "I am self-motivated and independent.", category: "Intelligence", subcategory: "Intrapersonal", section: "C" },
  { id: 98, text: "I keep a journal or diary regularly.", category: "Intelligence", subcategory: "Intrapersonal", section: "C" },
  { id: 99, text: "I set personal goals and work towards them.", category: "Intelligence", subcategory: "Intrapersonal", section: "C" },
  // Naturalist (100-104)
  { id: 100, text: "I enjoy being outdoors in nature.", category: "Intelligence", subcategory: "Naturalist", section: "C" },
  { id: 101, text: "I can identify different species of plants and animals.", category: "Intelligence", subcategory: "Naturalist", section: "C" },
  { id: 102, text: "I am interested in environmental issues.", category: "Intelligence", subcategory: "Naturalist", section: "C" },
  { id: 103, text: "I enjoy gardening or caring for animals.", category: "Intelligence", subcategory: "Naturalist", section: "C" },
  { id: 104, text: "I notice patterns in the natural world.", category: "Intelligence", subcategory: "Naturalist", section: "C" },
];

// Section D: Learning Style (105-119)
const learningStyleQuestions = [
  // Visual (105-109)
  { id: 105, text: "I learn best by looking at pictures and diagrams.", category: "LearningStyle", subcategory: "Visual", section: "D" },
  { id: 106, text: "I prefer to see information written down.", category: "LearningStyle", subcategory: "Visual", section: "D" },
  { id: 107, text: "I remember faces better than names.", category: "LearningStyle", subcategory: "Visual", section: "D" },
  { id: 108, text: "I use color coding and highlighting when studying.", category: "LearningStyle", subcategory: "Visual", section: "D" },
  { id: 109, text: "I prefer watching videos to reading text.", category: "LearningStyle", subcategory: "Visual", section: "D" },
  // Auditory (110-114)
  { id: 110, text: "I learn best by listening to lectures and discussions.", category: "LearningStyle", subcategory: "Auditory", section: "D" },
  { id: 111, text: "I remember things better when I hear them.", category: "LearningStyle", subcategory: "Auditory", section: "D" },
  { id: 112, text: "I enjoy group discussions and debates.", category: "LearningStyle", subcategory: "Auditory", section: "D" },
  { id: 113, text: "I often talk to myself when solving problems.", category: "LearningStyle", subcategory: "Auditory", section: "D" },
  { id: 114, text: "I prefer verbal instructions over written ones.", category: "LearningStyle", subcategory: "Auditory", section: "D" },
  // Kinesthetic (115-119)
  { id: 115, text: "I learn best through hands-on practice.", category: "LearningStyle", subcategory: "Kinesthetic", section: "D" },
  { id: 116, text: "I need to move around while studying.", category: "LearningStyle", subcategory: "Kinesthetic", section: "D" },
  { id: 117, text: "I prefer to build models or do experiments.", category: "LearningStyle", subcategory: "Kinesthetic", section: "D" },
  { id: 118, text: "I use gestures when explaining things.", category: "LearningStyle", subcategory: "Kinesthetic", section: "D" },
  { id: 119, text: "I enjoy role-playing and simulations.", category: "LearningStyle", subcategory: "Kinesthetic", section: "D" },
];

// Section E: Quotients (120-139)
const quotientQuestions = [
  // IQ (120-124)
  { id: 120, text: "I can solve complex problems quickly.", category: "Quotient", subcategory: "IQ", section: "E" },
  { id: 121, text: "I enjoy brain teasers and intellectual challenges.", category: "Quotient", subcategory: "IQ", section: "E" },
  { id: 122, text: "I can process and retain information efficiently.", category: "Quotient", subcategory: "IQ", section: "E" },
  { id: 123, text: "I think critically and analytically.", category: "Quotient", subcategory: "IQ", section: "E" },
  { id: 124, text: "I learn new concepts and skills rapidly.", category: "Quotient", subcategory: "IQ", section: "E" },
  // EQ (125-129)
  { id: 125, text: "I am aware of my own emotions and how they affect me.", category: "Quotient", subcategory: "EQ", section: "E" },
  { id: 126, text: "I can manage my emotions in stressful situations.", category: "Quotient", subcategory: "EQ", section: "E" },
  { id: 127, text: "I empathize with others and understand their feelings.", category: "Quotient", subcategory: "EQ", section: "E" },
  { id: 128, text: "I handle interpersonal relationships well.", category: "Quotient", subcategory: "EQ", section: "E" },
  { id: 129, text: "I can read social cues and body language.", category: "Quotient", subcategory: "EQ", section: "E" },
  // AQ (130-134)
  { id: 130, text: "I bounce back quickly from setbacks and failures.", category: "Quotient", subcategory: "AQ", section: "E" },
  { id: 131, text: "I see challenges as opportunities for growth.", category: "Quotient", subcategory: "AQ", section: "E" },
  { id: 132, text: "I persevere even when things get difficult.", category: "Quotient", subcategory: "AQ", section: "E" },
  { id: 133, text: "I maintain a positive attitude during adversity.", category: "Quotient", subcategory: "AQ", section: "E" },
  { id: 134, text: "I take responsibility for overcoming obstacles.", category: "Quotient", subcategory: "AQ", section: "E" },
  // CQ (135-139)
  { id: 135, text: "I come up with original and innovative ideas.", category: "Quotient", subcategory: "CQ", section: "E" },
  { id: 136, text: "I think outside the box to solve problems.", category: "Quotient", subcategory: "CQ", section: "E" },
  { id: 137, text: "I enjoy creative activities like art, writing, or design.", category: "Quotient", subcategory: "CQ", section: "E" },
  { id: 138, text: "I can see things from multiple perspectives.", category: "Quotient", subcategory: "CQ", section: "E" },
  { id: 139, text: "I am curious and enjoy exploring new concepts.", category: "Quotient", subcategory: "CQ", section: "E" },
];

// Section F: Career Mapping - RIASEC (140-199)
const careerQuestions = [
  // Realistic (140-149)
  { id: 140, text: "I enjoy working with tools and machines.", category: "Career", subcategory: "Realistic", section: "F" },
  { id: 141, text: "I prefer practical, hands-on tasks.", category: "Career", subcategory: "Realistic", section: "F" },
  { id: 142, text: "I like working outdoors.", category: "Career", subcategory: "Realistic", section: "F" },
  { id: 143, text: "I enjoy building and fixing things.", category: "Career", subcategory: "Realistic", section: "F" },
  { id: 144, text: "I prefer physical work over desk work.", category: "Career", subcategory: "Realistic", section: "F" },
  { id: 145, text: "I am good at operating equipment.", category: "Career", subcategory: "Realistic", section: "F" },
  { id: 146, text: "I enjoy working with animals.", category: "Career", subcategory: "Realistic", section: "F" },
  { id: 147, text: "I prefer concrete tasks with clear outcomes.", category: "Career", subcategory: "Realistic", section: "F" },
  { id: 148, text: "I like athletic or physical activities.", category: "Career", subcategory: "Realistic", section: "F" },
  { id: 149, text: "I prefer to work independently on practical projects.", category: "Career", subcategory: "Realistic", section: "F" },
  // Investigative (150-159)
  { id: 150, text: "I enjoy researching and investigating topics.", category: "Career", subcategory: "Investigative", section: "F" },
  { id: 151, text: "I like to solve complex scientific problems.", category: "Career", subcategory: "Investigative", section: "F" },
  { id: 152, text: "I enjoy reading scientific journals and articles.", category: "Career", subcategory: "Investigative", section: "F" },
  { id: 153, text: "I like to analyze data and draw conclusions.", category: "Career", subcategory: "Investigative", section: "F" },
  { id: 154, text: "I am curious about how things work.", category: "Career", subcategory: "Investigative", section: "F" },
  { id: 155, text: "I enjoy conducting experiments.", category: "Career", subcategory: "Investigative", section: "F" },
  { id: 156, text: "I prefer intellectual challenges over social activities.", category: "Career", subcategory: "Investigative", section: "F" },
  { id: 157, text: "I enjoy mathematics and statistics.", category: "Career", subcategory: "Investigative", section: "F" },
  { id: 158, text: "I like to understand theories and abstract concepts.", category: "Career", subcategory: "Investigative", section: "F" },
  { id: 159, text: "I prefer to work with ideas over people.", category: "Career", subcategory: "Investigative", section: "F" },
  // Artistic (160-169)
  { id: 160, text: "I enjoy creative activities like painting or drawing.", category: "Career", subcategory: "Artistic", section: "F" },
  { id: 161, text: "I like to express myself through art or music.", category: "Career", subcategory: "Artistic", section: "F" },
  { id: 162, text: "I enjoy creative writing and storytelling.", category: "Career", subcategory: "Artistic", section: "F" },
  { id: 163, text: "I appreciate beauty and aesthetics.", category: "Career", subcategory: "Artistic", section: "F" },
  { id: 164, text: "I prefer unstructured and flexible environments.", category: "Career", subcategory: "Artistic", section: "F" },
  { id: 165, text: "I enjoy performing arts like drama or dance.", category: "Career", subcategory: "Artistic", section: "F" },
  { id: 166, text: "I like to design and create new things.", category: "Career", subcategory: "Artistic", section: "F" },
  { id: 167, text: "I am imaginative and original.", category: "Career", subcategory: "Artistic", section: "F" },
  { id: 168, text: "I prefer to work independently on creative projects.", category: "Career", subcategory: "Artistic", section: "F" },
  { id: 169, text: "I enjoy photography or film-making.", category: "Career", subcategory: "Artistic", section: "F" },
  // Social (170-179)
  { id: 170, text: "I enjoy helping and teaching others.", category: "Career", subcategory: "Social", section: "F" },
  { id: 171, text: "I like working in teams and groups.", category: "Career", subcategory: "Social", section: "F" },
  { id: 172, text: "I am drawn to community service and volunteering.", category: "Career", subcategory: "Social", section: "F" },
  { id: 173, text: "I enjoy counseling and supporting people.", category: "Career", subcategory: "Social", section: "F" },
  { id: 174, text: "I like to organize social events.", category: "Career", subcategory: "Social", section: "F" },
  { id: 175, text: "I am a good communicator and mediator.", category: "Career", subcategory: "Social", section: "F" },
  { id: 176, text: "I enjoy nursing, healthcare, or therapy work.", category: "Career", subcategory: "Social", section: "F" },
  { id: 177, text: "I am patient with people who are learning.", category: "Career", subcategory: "Social", section: "F" },
  { id: 178, text: "I prefer to work with people over machines.", category: "Career", subcategory: "Social", section: "F" },
  { id: 179, text: "I enjoy understanding human behavior.", category: "Career", subcategory: "Social", section: "F" },
  // Enterprising (180-189)
  { id: 180, text: "I enjoy leading and managing people.", category: "Career", subcategory: "Enterprising", section: "F" },
  { id: 181, text: "I like to sell ideas and products.", category: "Career", subcategory: "Enterprising", section: "F" },
  { id: 182, text: "I am ambitious and goal-oriented.", category: "Career", subcategory: "Enterprising", section: "F" },
  { id: 183, text: "I enjoy public speaking and presentations.", category: "Career", subcategory: "Enterprising", section: "F" },
  { id: 184, text: "I like to take charge of projects.", category: "Career", subcategory: "Enterprising", section: "F" },
  { id: 185, text: "I enjoy negotiating and persuading.", category: "Career", subcategory: "Enterprising", section: "F" },
  { id: 186, text: "I am interested in business and entrepreneurship.", category: "Career", subcategory: "Enterprising", section: "F" },
  { id: 187, text: "I enjoy competition and challenges.", category: "Career", subcategory: "Enterprising", section: "F" },
  { id: 188, text: "I like influencing others' decisions.", category: "Career", subcategory: "Enterprising", section: "F" },
  { id: 189, text: "I am comfortable taking financial risks.", category: "Career", subcategory: "Enterprising", section: "F" },
  // Conventional (190-199)
  { id: 190, text: "I enjoy organizing files and data.", category: "Career", subcategory: "Conventional", section: "F" },
  { id: 191, text: "I like following established procedures.", category: "Career", subcategory: "Conventional", section: "F" },
  { id: 192, text: "I prefer working with numbers and records.", category: "Career", subcategory: "Conventional", section: "F" },
  { id: 193, text: "I am detail-oriented and thorough.", category: "Career", subcategory: "Conventional", section: "F" },
  { id: 194, text: "I enjoy administrative and clerical tasks.", category: "Career", subcategory: "Conventional", section: "F" },
  { id: 195, text: "I prefer structured work environments.", category: "Career", subcategory: "Conventional", section: "F" },
  { id: 196, text: "I like to maintain accurate records.", category: "Career", subcategory: "Conventional", section: "F" },
  { id: 197, text: "I enjoy accounting and bookkeeping.", category: "Career", subcategory: "Conventional", section: "F" },
  { id: 198, text: "I prefer routine and predictability at work.", category: "Career", subcategory: "Conventional", section: "F" },
  { id: 199, text: "I am comfortable with repetitive tasks if they are important.", category: "Career", subcategory: "Conventional", section: "F" },
];

export const allQuestions = [
  ...discQuestions,
  ...mbtiQuestions,
  ...intelligenceQuestions,
  ...learningStyleQuestions,
  ...quotientQuestions,
  ...careerQuestions,
];

export const sections = [
  { id: "A", name: "DISC Personality", range: [1, 24], category: "DISC" },
  { id: "B", name: "MBTI Personality", range: [25, 64], category: "MBTI" },
  { id: "C", name: "Multiple Intelligence", range: [65, 104], category: "Intelligence" },
  { id: "D", name: "Learning Style", range: [105, 119], category: "LearningStyle" },
  { id: "E", name: "Quotients", range: [120, 139], category: "Quotient" },
  { id: "F", name: "Career Mapping (RIASEC)", range: [140, 199], category: "Career" },
];
