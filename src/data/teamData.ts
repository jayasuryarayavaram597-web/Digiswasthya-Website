/**
 * teamData.ts — Single source of truth for all DigiSwasthya team data.
 *
 * USED BY:
 *   - src/app/our-team/page.tsx     → renders the Our Team page
 *   - src/data/botKnowledge.ts      → chatbot context
 *
 * To add/remove a team member: update this file ONLY.
 * Both the website and the chatbot will automatically reflect the change.
 */

export interface TeamMember {
    name: string;
    role: string;
    image?: string;
}

export const board: TeamMember[] = [
    { name: "Mr Sandeep Kumar",   role: "Founder & CEO",        image: "/images/sandeep-founder.png" },
    { name: "Dr Leena Saxena",    role: "Executive Director",   image: "/images/dr-leena-saxena.png" },
    { name: "Mr Shubham Badgujar",role: "Executive Director",   image: "/images/shubham-badgujar.png" },
];

export const coreTeam: TeamMember[] = [
    { name: "Mr. Sandeep Kumar",   role: "Founder and CEO",                             image: "/images/sandeep-founder.png" },
    { name: "Dr. Leena Saxena",    role: "MBBS, Executive Director",                    image: "/images/dr-leena-saxena.png" },
    { name: "Ms. Shashvi Thakur", role: "Head Program",                                image: "/images/shashvi-thakur.jpg" },
    { name: "Mr. Ashish Tiwari",  role: "Head of Strategy and Digital Transformation", image: "/images/ashish-tiwari.jpg" },
    { name: "Mr. Shubham Badgujar",role: "Chief Minister Fellow",                      image: "/images/shubham-badgujar.png" },
];

export const foundingTeam: TeamMember[] = [
    { name: "Mr Sandeep Kumar", role: "Founder",    image: "/images/sandeep-founder.png" },
    { name: "Km Mandakini",     role: "Co-Founder", image: "/images/km-mandakini.jpg" },
    { name: "Mr Santosh",       role: "Co-Founder", image: "/images/mr-santosh-cofounder.jpg" },
];

export const advisoryBoard: TeamMember[] = [
    { name: "Mr MP Mall",                    role: "Advisor", image: "/images/mr-mp-mall.jpg" },
    { name: "Dr AP Maheshwari IPS",          role: "Advisor", image: "/images/dr-ap-maheshwari.jpg" },
    { name: "Mr Sunil Kumar",                role: "Advisor", image: "/images/mr-sunil-kumar.png" },
    { name: "Mr Girish Nair",                role: "Advisor", image: "/images/mr-girish-nair.png" },
    { name: "Mr Sandeep Kapur",              role: "Advisor", image: "/images/mr-sandeep-kapur.jpg" },
    { name: "Dr Sabine Kapasi",              role: "Advisor", image: "/images/dr-sabine-kapasi.jpg" },
    { name: "Dr Colonel Prakash Chitalkar", role: "Advisor", image: "/images/dr-prakash-chitalkar.jpg" },
    { name: "Dr Ramandeep Singh Arora",     role: "Advisor", image: "/images/dr-ramandeep-arora.jpg" },
    { name: "Dr Chetan Purad",              role: "Advisor", image: "/images/dr-chetan-purad.jpg" },
    { name: "Dr Santwana V",                role: "Advisor", image: "/images/dr-santwana.jpg" },
    { name: "Mr Vaibhav Saxena",            role: "Advisor", image: "/images/mr-vaibhav-saxena.png" },
    { name: "Dr P.K. Rajput",              role: "Advisor", image: "/images/dr-pk-rajput.jpg" },
    { name: "Ms Sonali Maheshwari",         role: "Advisor", image: "/images/ms-sonali-maheshwari.jpg" },
    { name: "Mr Mrinal K Sharma",           role: "Advisor", image: "/images/mr-mrinal-sharma.png" },
    { name: "Mr Aritra De",                 role: "Advisor", image: "/images/aritra-de.jpg" },
];

export const doctors: TeamMember[] = [
    { name: "Dr. Leena Saxena",                role: "Specialist", image: "/images/dr-leena-saxena.png" },
    { name: "Dr. Ravi Landge",                 role: "Specialist", image: "/images/dr-ravi-landge.jpg" },
    { name: "Dr. Shruti Agrawal",              role: "Specialist", image: "/images/dr-shruti-agrawal.png" },
    { name: "Dr Shakti Singh Deora",           role: "Specialist", image: "/images/dr-shakti-singh.jpg" },
    { name: "Dr Shweta Bansal",                role: "Specialist", image: "/images/dr-shweta-bansal.jpg" },
    { name: "Dr Rajesh Bollam",                role: "Specialist", image: "/images/dr-rajesh-bollam.jpg" },
    { name: "Dr Bhuvnesh Chaturvedi",          role: "Specialist", image: "/images/dr-bhuvnesh-chaturvedi.jpg" },
    { name: "Dr Natasha Lalwani",              role: "Specialist", image: "/images/dr-natasha-lalwani.jpg" },
    { name: "Dr Meghna Maheshwari",            role: "Specialist", image: "/images/dr-meghna-maheshwari.jpg" },
    { name: "Dr Nehal Sanghani",               role: "Specialist", image: "/images/dr-nehal-sanghani.jpg" },
    { name: "Dr Anmol",                        role: "Specialist", image: "/images/dr-anmol.jpg" },
    { name: "Dr Akanksha Sabarwal",            role: "Specialist", image: "/images/dr-akanksha-sabarwal.png" },
    { name: "Ms Deepali Chaudhary",            role: "Specialist", image: "/images/ms-deepali-chaudhary.jpg" },
    { name: "Ms Jaitri Mandal",                role: "Specialist", image: "/images/ms-jaitri-mandal.jpg" },
    { name: "Dr Harshita Gupta",               role: "Specialist", image: "/images/dr-harshita-gupta.jpg" },
    { name: "Dr Charulata Sankhala",           role: "Specialist", image: "/images/dr-charulata-sankhala.jpg" },
    { name: "Dr Syed Amir Sohel Khandakar",   role: "Specialist", image: "/images/dr-syed-amir.jpg" },
    { name: "Ms Kajal S Chandra",              role: "Specialist", image: "/images/ms-kajal-s-chandra.jpg" },
    { name: "Ms. Mansvi Ahuja",                role: "Specialist", image: "/images/ms-mansvi-ahuja.png" },
    { name: "Dr. Sushant Mane",                role: "Specialist", image: "/images/dr-sushant-mane.png" },
    { name: "Dr Rupali Sharma",                role: "Specialist", image: "/images/dr-rupali-sharma.jpg" },
    { name: "Dr Liza Bulsara",                 role: "Specialist", image: "/images/dr-liza-bulsara.jpg" },
    { name: "Dr Megha Terse Mandke",           role: "Specialist", image: "/images/dr-megha-terse.jpg" },
    { name: "Dr Swati Singh",                  role: "Specialist", image: "/images/dr-swati-singh.jpg" },
    { name: "Dr Enamdar Arajuddin Moizuddin", role: "Specialist", image: "/images/dr-enamdar-arajuddin.jpg" },
    { name: "Dr. Sankalpa Suryawanshi",        role: "Specialist", image: "/images/dr-sankalpa-suryawanshi.jpg" },
    { name: "Dr. Lalitha Reddy Kudumula",      role: "Specialist", image: "/images/dr-lalitha-reddy.jpg" },
    { name: "Dr. Mahendra Oswal",              role: "Specialist", image: "/images/dr-mahendra-oswal.png" },
    { name: "Dr. Archana N Pathare",           role: "Specialist", image: "/images/dr-archana-pathare.jpg" },
    { name: "Dr. Seenu Yadav",                 role: "Specialist", image: "/images/dr-seenu-yadav.jpg" },
];

export const onGroundTeam: TeamMember[] = [
    { name: "Mr Ashish Tiwari",    role: "Specialist",                            image: "/images/ashish-tiwari.jpg" },
    { name: "Ms Shashvi Thakur",   role: "Specialist",                            image: "/images/shashvi-thakur.jpg" },
    { name: "Km Mandakini",         role: "Operations Manager",                   image: "/images/km-mandakini.jpg" },
    { name: "Ms Ragini Yadav",      role: "Doctors Relationship and Training Lead", image: "/images/ragini-yadav.jpg" },
    { name: "Mr Tushar Chauhan",    role: "Graphics Designer",                    image: "/images/tushar-chauhan.jpg" },
    { name: "Mr Aayush Chauhan",    role: "Accountant",                           image: "/images/mr-aayush-chauhan.png" },
    { name: "Ms Shaleeni Yadav",    role: "Nurse",                                image: "/images/ms-shaleeni-yadav.png" },
    { name: "Mr. Ashok Kumar",      role: "Project Coordinator",                  image: "/images/mr-ashok-kumar.jpg" },
    { name: "Ms Sejal Katale",      role: "Centre Coordinator",                   image: "/images/ms-sejal-katale.jpg" },
    { name: "Ms Sushma Swaraj",     role: "Centre Coordinator",                   image: "/images/ms-sushma-swaraj.jpg" },
    { name: "Mr Rahul Kumar",       role: "Admin",                                image: "/images/rahul-kumar.jpg" },
    { name: "Ms Shivani Mali",      role: "Sr Patient Navigator",                 image: "/images/shivani-mali.jpg" },
    { name: "Mr Pranjal Suhagpure", role: "Project Coordinator",                  image: "/images/pranjal-suhagpure.png" },
    { name: "Ms Manisha Kumari",    role: "Patient Navigator",                    image: "/images/manisha-kumari.jpg" },
    { name: "Mr Divyanshu Gupta",   role: "Centre Lead",                          image: "/images/divyanshu-gupta.jpg" },
    { name: "Ms Sathi Biswas",      role: "Sr Patient Navigator",                 image: "/images/sathi-biswas.jpg" },
    { name: "Ms Punita Yadav",      role: "Patient Navigator",                    image: "/images/punita-yadav.jpg" },
    { name: "Ms Annu Gautam",       role: "Patient Navigator",                    image: "/images/annu-gautam.jpg" },
];
