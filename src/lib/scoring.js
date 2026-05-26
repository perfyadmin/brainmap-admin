import { allQuestions } from "./questions";

function calcSubcategoryScore(responses, category, subcategory) {
  return allQuestions
    .filter(q => q.category === category && q.subcategory === subcategory)
    .reduce((sum, q) => sum + (responses[q.id] || 3), 0);
}

function calcSubcategoryMax(category, subcategory) {
  return allQuestions.filter(q => q.category === category && q.subcategory === subcategory).length * 5;
}

export function calculateDISC(responses) {
  const subs = ["D", "I", "S", "C"];
  const scores = {};
  const percentages = {};
  subs.forEach(s => {
    scores[s] = calcSubcategoryScore(responses, "DISC", s);
    percentages[s] = Math.round((scores[s] / calcSubcategoryMax("DISC", s)) * 100);
  });
  const dominant = subs.reduce((a, b) => scores[a] > scores[b] ? a : b);
  const birdMap = { D: "Eagle", I: "Parrot", S: "Dove", C: "Owl" };
  const nameMap = { D: "Dominant", I: "Influential", S: "Steady", C: "Compliant" };
  return {
    D: scores.D, I: scores.I, S: scores.S, C: scores.C,
    dominant: `${nameMap[dominant]} (${birdMap[dominant]})`,
    bird: birdMap[dominant],
    percentages: percentages,
  };
}

export function calculateMBTI(responses) {
  const pairs = [["E", "I"], ["S", "N"], ["T", "F"], ["J", "P"]];
  const scores = {};
  pairs.flat().forEach(s => {
    scores[s] = calcSubcategoryScore(responses, "MBTI", s);
  });
  const type = pairs.map(([a, b]) => scores[a] >= scores[b] ? a : b).join("");
  return { type, scores };
}

export function calculateIntelligence(responses) {
  const types = ["Linguistic", "Logical", "Musical", "Spatial", "Kinesthetic", "Interpersonal", "Intrapersonal", "Naturalist"];
  const scores = {};
  const percentages = {};
  types.forEach(t => {
    scores[t] = calcSubcategoryScore(responses, "Intelligence", t);
    percentages[t] = Math.round((scores[t] / calcSubcategoryMax("Intelligence", t)) * 100);
  });
  const sorted = [...types].sort((a, b) => scores[b] - scores[a]);
  return { scores, percentages, top2: sorted.slice(0, 2) };
}

export function calculateLearningStyle(responses) {
  const types = ["Visual", "Auditory", "Kinesthetic"];
  const scores = {};
  const percentages = {};
  types.forEach(t => {
    scores[t] = calcSubcategoryScore(responses, "LearningStyle", t);
    percentages[t] = Math.round((scores[t] / calcSubcategoryMax("LearningStyle", t)) * 100);
  });
  const dominant = types.reduce((a, b) => scores[a] > scores[b] ? a : b);
  return { scores, dominant, percentages };
}

export function calculateQuotients(responses) {
  const types = ["IQ", "EQ", "AQ", "CQ"];
  const result = {};
  types.forEach(t => {
    const score = calcSubcategoryScore(responses, "Quotient", t);
    const max = calcSubcategoryMax("Quotient", t);
    result[t] = Math.round((score / max) * 100);
  });
  return result;
}

export function calculateCareer(responses) {
  const types = ["Realistic", "Investigative", "Artistic", "Social", "Enterprising", "Conventional"];
  const scores = {};
  const percentages = {};
  types.forEach(t => {
    scores[t] = calcSubcategoryScore(responses, "Career", t);
    percentages[t] = Math.round((scores[t] / calcSubcategoryMax("Career", t)) * 100);
  });
  const sorted = [...types].sort((a, b) => scores[b] - scores[a]);
  const top2 = sorted.slice(0, 2);

  const roleMap = {
    Realistic: ["Engineer", "Mechanic", "Architect", "Farmer"],
    Investigative: ["Scientist", "Researcher", "Data Analyst", "Doctor"],
    Artistic: ["Designer", "Writer", "Musician", "Film Director"],
    Social: ["Teacher", "Counselor", "HR Manager", "Social Worker"],
    Enterprising: ["CEO", "Sales Manager", "Entrepreneur", "Lawyer"],
    Conventional: ["Accountant", "Administrator", "Bank Officer", "Auditor"],
  };
  const suggestedRoles = [...(roleMap[top2[0]] || []).slice(0, 2), ...(roleMap[top2[1]] || []).slice(0, 2)];
  return { scores, percentages, top2, suggestedRoles };
}

export function calculateBrainDominance(responses) {
  const quotients = calculateQuotients(responses);
  const disc = calculateDISC(responses);
  const left = Math.round((quotients.IQ + disc.percentages.C + calcSubcategoryScore(responses, "Intelligence", "Logical") / calcSubcategoryMax("Intelligence", "Logical") * 100) / 3);
  const right = Math.round((quotients.EQ + quotients.CQ + calcSubcategoryScore(responses, "Career", "Artistic") / calcSubcategoryMax("Career", "Artistic") * 100) / 3);
  const total = left + right || 1;
  return { left: Math.round((left / total) * 100), right: Math.round((right / total) * 100) };
}

export function calculateSWOT(results) {
  const strengths = [];
  const weaknesses = [];
  const opportunities = [];
  const threats = [];

  if (results.quotients.IQ >= 75) strengths.push("Strong Analytical Thinking");
  if (results.quotients.EQ >= 75) strengths.push("High Emotional Intelligence");
  if (results.quotients.CQ >= 75) strengths.push("Creative Problem Solving");
  if (results.quotients.AQ >= 75) strengths.push("Resilience & Adaptability");

  results.intelligence.top2.forEach(t => strengths.push(`${t} Intelligence`));

  if (results.quotients.IQ < 50) weaknesses.push("Needs Analytical Development");
  if (results.quotients.EQ < 50) weaknesses.push("Needs Emotional Awareness");
  if (results.quotients.CQ < 50) weaknesses.push("Limited Creative Thinking");
  if (results.quotients.AQ < 50) weaknesses.push("Low Risk Tolerance");
  if (weaknesses.length === 0) weaknesses.push("Moderate areas identified for growth");

  results.career.top2.forEach(t => opportunities.push(`${t} career paths`));
  results.career.suggestedRoles.slice(0, 2).forEach(r => opportunities.push(`Role: ${r}`));

  if (results.quotients.AQ < 60) threats.push("Low Adversity Quotient");
  if (results.quotients.EQ < 60) threats.push("Emotional Management Challenges");
  if (threats.length === 0) threats.push("No significant threats identified");

  return { strengths, weaknesses, opportunities, threats };
}

export function calculateAllResults(responses, isEmployee = false) {
  const disc = calculateDISC(responses);
  const mbti = calculateMBTI(responses);
  const intelligence = calculateIntelligence(responses);
  const learningStyle = calculateLearningStyle(responses);
  const quotients = calculateQuotients(responses);
  const career = calculateCareer(responses);
  const brainDominance = calculateBrainDominance(responses);

  const partial = { disc, mbti, intelligence, learningStyle, quotients, career, brainDominance };
  const swot = calculateSWOT(partial);

  return { ...partial, swot };
}
