function tokenize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(' ').filter(w => w.length > 1);
}
const subject = "Application for Data Engineer - San Antonio, TX, Dallas, TX, Austin, TX, Houston, TX at TechniPros, LLC sent";
const companyName = "TechniPros, LLC";
const jobTitle = "Data Engineer";

const subjectTokens = tokenize(subject);
const companyTokens = tokenize(companyName);
const titleTokens = tokenize(jobTitle);

const matchCompany = companyTokens.length > 0 && companyTokens.some(w => subjectTokens.includes(w));
const matchTitle = titleTokens.length > 0 && titleTokens.filter(w => subjectTokens.includes(w)).length >= Math.min(2, titleTokens.length);

console.log({ matchCompany, matchTitle });
