#!/usr/bin/env node
/**
 * Marblism Partners — Maintenance Mode Toggle
 * ─────────────────────────────────────────────
 * Usage:
 *   node scripts/toggle-maintenance.js           ← toggles current state
 *   node scripts/toggle-maintenance.js on        ← force maintenance ON
 *   node scripts/toggle-maintenance.js off       ← force maintenance OFF (go live)
 *   node scripts/toggle-maintenance.js status    ← print current mode
 *
 * After switching, the script builds, commits, and pushes automatically.
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PAGES = join(ROOT, 'src', 'pages');

// ─────────────────────────────────────────────────────────────────────────────
// LIVE PAGE CONTENT
// ─────────────────────────────────────────────────────────────────────────────

const LIVE = {

  'index.astro': `---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import UseCases from '../components/UseCases.astro';
import Services from '../components/Services.astro';
import Process from '../components/Process.astro';
import Contact from '../components/Contact.astro';
import Footer from '../components/Footer.astro';
---
<Layout>
  <Nav />
  <main>
    <Hero />
    <UseCases />
    <Services />
    <Process />
    <Contact />
  </main>
  <Footer />
</Layout>
`,

  'luxury.astro': `---
import LuxuryLayout from '../layouts/LuxuryLayout.astro';
import { REFERRAL_URL, PARTNER_EMAIL } from '../data/referral';

const verticals = [
  { slug: '/real-estate',     label: 'Luxury Real Estate',            tagline: 'Never miss a qualified buyer',           desc: 'Linda reviews contracts. Rachel answers every call. Stan sources off-market prospects.',                                        icon: '🏛️' },
  { slug: '/medspa',          label: 'Medical Aesthetics',            tagline: 'Fill your chair, protect your brand',    desc: 'Rachel books consultations 24/7. Eva sends pre-care and follow-up. Penny drives organic discovery.',                          icon: '✦'  },
  { slug: '/salon',           label: 'Luxury Salons & Spas',          tagline: 'White-glove service starts before they walk in', desc: 'Rachel handles every booking request. Sonny builds your social presence. Penny tells your story.',              icon: '◈'  },
  { slug: '/wealth',          label: 'Wealth & Financial Advisory',   tagline: 'Your AI team handles the detail work',   desc: 'Eva manages your inbox and meeting prep. Linda reviews agreements. Stan sources ideal prospects.',                           icon: '◆'  },
  { slug: '/interior-design', label: 'Interior Design & Architecture',tagline: 'Less admin. More creating.',             desc: 'Eva drafts proposals and client replies. Stan surfaces high-value leads. Penny builds editorial authority.',                  icon: '⬡'  },
];
---
<LuxuryLayout title="Luxury AI Solutions — Marblism Partners" description="AI employees built for businesses where reputation is everything.">
  <header class="nav"><div class="container nav-inner"><a href="/" class="back">← Back to Marblism Partners</a><a href={REFERRAL_URL} class="btn btn-gold" target="_blank" rel="noopener">Get your AI team</a></div></header>
  <section class="hero"><div class="container"><p class="eyebrow">Luxury Business Solutions</p><div class="divider"></div><h1>Your brand is your reputation.<br /><em>Protect it with AI.</em></h1><p class="lead">Marblism AI Employees work behind the scenes — handling calls, contracts, outreach, and content — so every client touchpoint reflects the standard your brand demands.</p><div class="hero-ctas"><a href={REFERRAL_URL} class="btn btn-gold" target="_blank" rel="noopener">Start with a free consult</a><a href="#verticals" class="btn btn-outline">Explore your industry →</a></div><p class="guarantee">7-day money-back guarantee · Live in 48 hours · No contracts</p></div></section>
  <div class="promise-strip"><div class="container promise-inner"><span>"An AI team that never breaks character."</span><span class="sep">—</span><span>"Outbound that reads like a personal introduction."</span><span class="sep">—</span><span>"Contracts reviewed before you sign, every time."</span></div></div>
  <section id="verticals" class="verticals"><div class="container"><p class="eyebrow">Your industry</p><div class="divider"></div><h2>Built for businesses where<br />every detail matters.</h2><p class="section-sub">Select your industry for a tailored breakdown of which AI Employees work hardest for you.</p><div class="vgrid">{verticals.map((v) => (<a href={v.slug} class="vcard"><div class="vicon">{v.icon}</div><div class="vcontent"><span class="vlabel">{v.label}</span><h3>{v.tagline}</h3><p>{v.desc}</p><span class="vlink">See full breakdown →</span></div></a>))}</div></div></section>
  <footer class="lx-footer"><div class="container lx-footer-inner"><a href="/"><img src="/logo.svg" height="20" alt="Marblism Partners" /></a><p>© {new Date().getFullYear()} Marblism Partners</p><div class="lx-links"><a href="/">Home</a><a href={REFERRAL_URL} target="_blank" rel="noopener">Get Marblism</a></div></div></footer>
</LuxuryLayout>
`,

  'real-estate.astro': `---
import IndustryPage from '../components/industries/IndustryPage.astro';
const employees = [
  { name:'Rachel', role:'Receptionist',        fit:"Answers every inbound call, qualifies buyers and sellers with your screening questions, and books showings directly on your calendar — including evenings and weekends when deals actually happen.", grad:'linear-gradient(135deg,#10b981,#14b8a6)' },
  { name:'Stan',   role:'Lead Generation',     fit:"Identifies off-market prospects, absentee owners, and motivated sellers in your target market. Sends personalized outreach that reads like a personal introduction — not a cold email blast.",  grad:'linear-gradient(135deg,#7c3aed,#3b82f6)' },
  { name:'Linda',  role:'Legal Assistant',     fit:"Pre-reviews purchase agreements, addenda, and disclosure packets before they hit your desk. Flags unusual clauses and translates legal language into plain English so you can act fast.",         grad:'linear-gradient(135deg,#3b82f6,#7c3aed)' },
  { name:'Eva',    role:'Executive Assistant', fit:"Manages your inbox, drafts follow-up emails in your voice, tracks transaction timelines, and surfaces the three things that actually need your attention today — not the 80 emails that don't.", grad:'linear-gradient(135deg,#14b8a6,#06b6d4)' },
];
const pains = [
  { before:"Buyer calls during showings go to voicemail — they've already called someone else by the time you call back",        after:"Rachel answers every call, qualifies the lead, and books the showing while you're still with another client" },
  { before:"2+ hours reviewing purchase agreements for risks you might be missing",                                               after:"Linda pre-screens every contract and flags unusual clauses in under 5 minutes — you review what matters" },
  { before:"Cold outreach to homeowners feels generic, gets ignored, and takes hours to write",                                   after:"Stan identifies motivated sellers and sends personalized introductions that actually get replies" },
  { before:"Follow-up emails pile up while you're on the road between showings",                                                  after:"Eva drafts replies in your voice, ready to send with one click — nothing falls through the cracks" },
  { before:"Transaction deadlines sneak up in a flood of email threads",                                                          after:"Eva tracks every timeline and pings you when something needs action — before it becomes a problem" },
];
---
<IndustryPage industry="Real Estate" icon="🏘️" tagline="Your next commission shouldn\\'t depend on <span class=\\'grad\\'>who picked up the phone.</span>" subhead="Real estate is a relationship business. But relationships get lost in missed calls, slow contract reviews, and cold outreach that never lands. Your Marblism AI team fixes all three — so you can close deals instead of managing your inbox." cta="Hire my real estate AI team" employees={employees} pains={pains} seoTitle="AI Employees for Real Estate Agents — Marblism Partners" seoDesc="Rachel qualifies buyers 24/7. Stan sources leads. Linda reviews contracts. Eva runs your inbox. Your full Marblism AI team, live in 48 hours." />
<style is:global>.grad{background:linear-gradient(135deg,var(--accent),var(--accent-2));-webkit-background-clip:text;background-clip:text;color:transparent}</style>
`,

  'spa.astro': `---
import IndustryPage from '../components/industries/IndustryPage.astro';
const employees = [
  { name:'Rachel', role:'Receptionist',        fit:"Books appointments the moment a client calls — even during a treatment, even at 10pm. Sends confirmation texts, 48-hour reminders, and same-day nudges so no-shows drop dramatically.",                                    grad:'linear-gradient(135deg,#10b981,#14b8a6)' },
  { name:'Sonny',  role:'Community Manager',   fit:"Keeps your Instagram and Facebook active with on-brand content, replies to DMs and comments, and routes warm leads straight to your booking link — without you touching your phone.",                                      grad:'linear-gradient(135deg,#f97316,#ec4899)' },
  { name:'Eva',    role:'Executive Assistant', fit:"Sends post-treatment follow-ups in your voice, manages rebooking reminders at the perfect interval, and handles supplier and product vendor emails so your inbox doesn't spiral.",                                         grad:'linear-gradient(135deg,#14b8a6,#06b6d4)' },
  { name:'Penny',  role:'SEO Blog Writer',     fit:"Publishes educational, keyword-optimized content about your treatments every week — the kind that ranks on Google and brings in clients who already know what they want.",                                                   grad:'linear-gradient(135deg,#f59e0b,#ec4899)' },
];
const pains = [
  { before:"Phone rings mid-treatment — you can't answer, client hangs up and books elsewhere",               after:"Rachel answers every call, books the slot, and sends a confirmation — while you focus on your client" },
  { before:"No-shows cost you 2–3 hours of revenue every week",                                                after:"Eva sends automatic reminders at 48 hours and 2 hours before — no-shows drop by over 60%" },
  { before:"Instagram goes dark for two weeks every time you get busy",                                        after:"Sonny posts consistently, responds to DMs, and keeps your booking link visible even when you're slammed" },
  { before:"Clients drift away after one visit because no one followed up",                                    after:"Eva sends a warm check-in and rebooking nudge at the right moment, in your voice" },
  { before:"You're writing blog content at midnight — or not at all",                                          after:"Penny publishes SEO-optimized treatment content on a weekly schedule, building your organic traffic while you sleep" },
];
---
<IndustryPage industry="Spa & Wellness" icon="🧖" tagline="You\\'re a healer. <span class=\\'grad\\'>Not a receptionist.</span>" subhead="Spa owners lose hours every week answering booking calls, chasing no-shows, and trying to stay active on social media. Your Marblism AI team handles all of it — in your brand's voice, around the clock." cta="Hire my spa AI team" employees={employees} pains={pains} seoTitle="AI Employees for Spa & Wellness Owners — Marblism Partners" seoDesc="Rachel books appointments 24/7. Sonny runs your social. Eva sends rebooking reminders. Penny writes your SEO content." />
<style is:global>.grad{background:linear-gradient(135deg,var(--accent),var(--accent-2));-webkit-background-clip:text;background-clip:text;color:transparent}</style>
`,

  'travel.astro': `---
import IndustryPage from '../components/industries/IndustryPage.astro';
const employees = [
  { name:'Rachel', role:'Receptionist',        fit:"Answers every inquiry call, gathers the essential details (destination, budget, travel dates, group size), and books a consultation directly on your calendar — so no lead goes cold over the weekend.",                      grad:'linear-gradient(135deg,#10b981,#14b8a6)' },
  { name:'Eva',    role:'Executive Assistant', fit:"Manages the complex, multi-thread email chains that come with every itinerary. Drafts client updates, handles supplier confirmations, sends pre-trip briefings, and follows up post-trip to turn great experiences into repeat bookings.", grad:'linear-gradient(135deg,#14b8a6,#06b6d4)' },
  { name:'Stan',   role:'Lead Generation',     fit:"Identifies ideal new clients — corporate travel managers, destination wedding planners, luxury family travelers — and opens conversations with warm, personalized outreach that gets replies.",                                 grad:'linear-gradient(135deg,#7c3aed,#3b82f6)' },
  { name:'Penny',  role:'SEO Blog Writer',     fit:"Publishes destination guides, packing lists, and 'best time to visit' articles that rank on Google and bring in travelers who are already in research mode — before they book with someone else.",                             grad:'linear-gradient(135deg,#f59e0b,#ec4899)' },
];
const pains = [
  { before:"Inquiry calls come in when you're with a client or mid-itinerary — they go to voicemail and go cold",   after:"Rachel answers, gets the details, and books a consult on your calendar — every time, no exceptions" },
  { before:"Your inbox is a jungle of supplier confirmations, client questions, and change requests",                 after:"Eva organizes every thread, drafts replies in your voice, and keeps every itinerary moving forward" },
  { before:"You rely entirely on referrals — great when it works, terrifying when it slows down",                     after:"Stan runs a consistent outreach cadence to your ideal client profile, so new business isn't just luck" },
  { before:"Your website has no organic traffic — clients have to already know you exist",                            after:"Penny publishes destination content that ranks and brings in travelers who find you through Google" },
  { before:"After a trip, the relationship fades because post-trip follow-up is always the last priority",            after:"Eva sends a thoughtful post-trip check-in and plants the seed for the next adventure — in your voice" },
];
---
<IndustryPage industry="Travel Advisors" icon="✈️" tagline="You sell experiences. <span class=\\'grad\\'>Not inbox management.</span>" subhead="High-touch travel clients expect instant responses, flawless logistics, and a consultant who's always available. Your Marblism AI team handles the follow-through so you can focus on the craft." cta="Hire my travel AI team" employees={employees} pains={pains} seoTitle="AI Employees for Travel Advisors — Marblism Partners" seoDesc="Rachel handles inquiry calls. Eva manages your itinerary inbox. Stan finds new clients. Penny builds your SEO presence." />
<style is:global>.grad{background:linear-gradient(135deg,var(--accent),var(--accent-2));-webkit-background-clip:text;background-clip:text;color:transparent}</style>
`,

  'office.astro': `---
import IndustryPage from '../components/industries/IndustryPage.astro';
const employees = [
  { name:'Eva',    role:'Executive Assistant', fit:"Triages your inbox and surfaces only the emails that need a decision. Drafts replies in your voice, schedules meetings, preps briefing docs before every call, and turns meeting recordings into clean action-item lists.",      grad:'linear-gradient(135deg,#14b8a6,#06b6d4)' },
  { name:'Rachel', role:'Receptionist',        fit:"Handles every inbound call professionally — routes to the right person, takes detailed messages, and keeps a log. Nobody gets lost in the phone queue, and you stop being the default answer for every caller.",                 grad:'linear-gradient(135deg,#10b981,#14b8a6)' },
  { name:'Linda',  role:'Legal Assistant',     fit:"Reviews vendor contracts, service agreements, software subscriptions, and NDAs before you sign. Flags non-standard payment terms, auto-renewal clauses, liability caps, and anything that warrants a second look.",             grad:'linear-gradient(135deg,#3b82f6,#7c3aed)' },
  { name:'Stan',   role:'Lead Generation',     fit:"Handles outbound vendor sourcing and supplier prospecting — finds vetted candidates, makes first contact, and qualifies them before they hit your desk. You evaluate options instead of hunting for them.",                       grad:'linear-gradient(135deg,#7c3aed,#3b82f6)' },
];
const pains = [
  { before:"200 emails a day — half of them low-priority, all of them eating your time",                              after:"Eva triages everything, drafts the replies that matter, and surfaces the 10 that actually need you" },
  { before:"Every vendor contract reviewed under time pressure — you catch what you catch",                            after:"Linda pre-screens every agreement and flags risky terms before it hits your desk for final sign-off" },
  { before:"Interruption calls pull you out of focused work 10 times a day",                                          after:"Rachel handles calls professionally, routes the right ones, and logs everything so nothing slips" },
  { before:"Meeting prep is rushed because there's never enough time before the call",                                 after:"Eva prepares a clean one-page briefing doc before every meeting — you walk in ready, every time" },
  { before:"Sourcing new vendors is reactive and time-consuming when your current one falls short",                    after:"Stan runs proactive outreach to pre-vetted suppliers so you always have a qualified backup pipeline" },
];
---
<IndustryPage industry="Office Managers" icon="🗂️" tagline="Everyone needs you. <span class=\\'grad\\'>Now you have backup.</span>" subhead="Office managers are the operational hub of every business — handling more than any one person should. Your Marblism AI team takes the repeatable work off your plate so you can focus on the decisions that actually need a human." cta="Hire my office AI team" employees={employees} pains={pains} seoTitle="AI Employees for Office Managers — Marblism Partners" seoDesc="Eva runs your inbox. Rachel handles calls. Linda reviews vendor contracts. Stan sources suppliers. Your Marblism AI team, live in 48 hours." />
<style is:global>.grad{background:linear-gradient(135deg,var(--accent),var(--accent-2));-webkit-background-clip:text;background-clip:text;color:transparent}</style>
`,

  'medspa.astro':         verticalPage('medspa'),
  'salon.astro':          verticalPage('salon'),
  'wealth.astro':         verticalPage('wealth'),
  'interior-design.astro':verticalPage('interior-design'),
};

function verticalPage(slug) {
  const map = {
    'real-estate':    { industry: 'Luxury Real Estate',             tagline: "Never lose a qualified buyer to a missed call.",         subhead: "In luxury real estate, response time and contract precision are the difference between a closed deal and a referral you never get back.",  cta: 'Hire your real estate AI team',  employees: [{ name:'Rachel',role:'Receptionist',fit:"Answers every inbound call, qualifies buyers and sellers, and books showings directly on your calendar — including evenings and weekends.",grad:'linear-gradient(135deg,#10b981,#14b8a6)' },{ name:'Stan',role:'Lead Generation',fit:"Identifies off-market prospects, absentee owners, and portfolio sellers. Sends personalized outreach that reads like a personal introduction.",grad:'linear-gradient(135deg,#7c3aed,#3b82f6)' },{ name:'Linda',role:'Legal Assistant',fit:"Reviews purchase agreements, addenda, and disclosure packets. Flags unusual clauses and translates legalese in minutes.",grad:'linear-gradient(135deg,#3b82f6,#7c3aed)' },{ name:'Eva',role:'Executive Assistant',fit:"Manages your inbox, drafts follow-up emails, prepares showing briefs, and keeps transaction timelines organized.",grad:'linear-gradient(135deg,#14b8a6,#06b6d4)' }], pains:[{ before:"Missed buyer calls become closed deals for a competitor",after:"Rachel answers every call, qualifies the lead, books the showing" },{ before:"2 hours reviewing each purchase agreement for risks",after:"Linda flags unusual clauses in under 5 minutes" },{ before:"Cold outreach to owners feels generic, gets ignored",after:"Stan sends personalized introductions that get replies" },{ before:"Follow-up emails pile up while you're on the road",after:"Eva drafts replies in your voice, ready to send in one click" },{ before:"Transaction deadlines get missed in the email chaos",after:"Eva tracks every timeline and surfaces what needs attention today" }] },
    'medspa':         { industry: 'Medical Aesthetics & Med Spas',   tagline: "Fill your chair. Protect your reputation.",               subhead: "Luxury med spa clients expect discretion, precision, and instant responsiveness. Your AI team delivers all three.",                                   cta: 'Hire your med spa AI team',      employees: [{ name:'Rachel',role:'Receptionist',fit:"Books consultation requests the moment they come in — day or night. Qualifies each inquiry, confirms appointments, and sends pre-care instructions.",grad:'linear-gradient(135deg,#10b981,#14b8a6)' },{ name:'Eva',role:'Executive Assistant',fit:"Sends post-treatment follow-ups in your brand's voice, manages rebooking reminders, handles vendor emails.",grad:'linear-gradient(135deg,#14b8a6,#06b6d4)' },{ name:'Penny',role:'SEO Blog Writer',fit:"Publishes educational content around your treatments that ranks in search and brings in clients who already understand your services.",grad:'linear-gradient(135deg,#f59e0b,#ec4899)' },{ name:'Sonny',role:'Community Manager',fit:"Manages your Instagram and social presence, responds to DMs, and turns story engagement into booked consultations.",grad:'linear-gradient(135deg,#f97316,#ec4899)' }], pains:[{ before:"Consultation requests come in after hours and go cold",after:"Rachel books them instantly, 24/7, with qualifying questions built in" },{ before:"Post-treatment follow-up is inconsistent or skipped",after:"Eva sends personalized follow-ups at the right intervals, in your voice" },{ before:"Your website doesn't rank for high-intent treatment searches",after:"Penny publishes SEO content that brings in pre-qualified clients" },{ before:"DMs pile up and leads go cold on Instagram",after:"Sonny manages engagement and routes warm leads to your booking page" },{ before:"Rebooking relies on the client remembering to call",after:"Eva sends timely rebooking reminders that feel personal, not automated" }] },
    'salon':          { industry: 'Luxury Salons & Spas',            tagline: "White-glove service starts before they walk in the door.", subhead: "Your clients chose you for the experience. Your AI team makes sure that experience starts the moment they reach out.",                             cta: 'Hire your salon AI team',        employees: [{ name:'Rachel',role:'Receptionist',fit:"Takes every booking request, matches clients to the right stylist, confirms appointments, and sends reminders — in the warm tone your brand demands.",grad:'linear-gradient(135deg,#10b981,#14b8a6)' },{ name:'Sonny',role:'Community Manager',fit:"Keeps your Instagram active with curated content, responds to comments and DMs, and turns followers into first-time bookings.",grad:'linear-gradient(135deg,#f97316,#ec4899)' },{ name:'Penny',role:'SEO Blog Writer',fit:"Writes editorial-quality content that ranks in local search and establishes your salon as the authority in your market.",grad:'linear-gradient(135deg,#f59e0b,#ec4899)' },{ name:'Eva',role:'Executive Assistant',fit:"Handles supplier emails, product reorder requests, staff communications, and the administrative overflow.",grad:'linear-gradient(135deg,#14b8a6,#06b6d4)' }], pains:[{ before:"Missed calls during busy hours mean lost bookings",after:"Rachel captures every request, even when you're fully in the zone" },{ before:"Social stays dormant for weeks when things get busy",after:"Sonny keeps your presence consistent without you thinking about it" },{ before:"Clients drift to a competitor between appointments",after:"Rachel sends rebooking reminders at exactly the right moment" },{ before:"No time to write the content that would drive new traffic",after:"Penny publishes polished, SEO-optimized posts on a regular schedule" },{ before:"Admin emails pile up and slow down your operations",after:"Eva handles supplier and vendor correspondence so you stay on the floor" }] },
    'wealth':         { industry: 'Wealth & Financial Advisory',     tagline: "Your clients deserve your full attention. Give it to them.", subhead: "High-net-worth clients don't tolerate slow responses or sloppy agreements. Your AI team handles the detail work.",                              cta: 'Hire your advisory AI team',     employees: [{ name:'Eva',role:'Executive Assistant',fit:"Triages your inbox, drafts client responses in your voice, prepares meeting briefings, and maintains the correspondence standards your HNW clients expect.",grad:'linear-gradient(135deg,#14b8a6,#06b6d4)' },{ name:'Linda',role:'Legal Assistant',fit:"Reviews advisory agreements, engagement letters, NDAs, and service contracts before they reach your desk. Flags non-standard terms.",grad:'linear-gradient(135deg,#3b82f6,#7c3aed)' },{ name:'Stan',role:'Lead Generation',fit:"Identifies prospective clients that match your ideal profile and crafts introductions that open conversations without feeling like a sales pitch.",grad:'linear-gradient(135deg,#7c3aed,#3b82f6)' },{ name:'Rachel',role:'Receptionist',fit:"Handles inbound inquiry calls, gathers preliminary information, and ensures every caller is treated with the discretion your practice is known for.",grad:'linear-gradient(135deg,#10b981,#14b8a6)' }], pains:[{ before:"3 hours a day managing inbox, most of it low-value",after:"Eva surfaces only what needs your decision — everything else is handled" },{ before:"Reviewing every agreement yourself before it's signed",after:"Linda pre-screens and flags anything that warrants your attention" },{ before:"Outreach to ideal prospects feels time-consuming and inconsistent",after:"Stan runs a steady, personalized prospecting cadence in the background" },{ before:"Inbound calls interrupt deep work with the wrong callers",after:"Rachel qualifies every inbound and only escalates genuine opportunities" },{ before:"Meeting prep is rushed because admin takes too long",after:"Eva prepares a clean briefing doc before every client call" }] },
    'interior-design':{ industry: 'Interior Design & Architecture',  tagline: "Less admin. More creating.",                             subhead: "Your best work happens when you're deep in a project, not chasing proposals, vetting vendors, and answering the same client questions.",        cta: 'Hire your design AI team',       employees: [{ name:'Eva',role:'Executive Assistant',fit:"Drafts project proposals, responds to client emails in your voice, manages vendor follow-ups, and coordinates with contractors.",grad:'linear-gradient(135deg,#14b8a6,#06b6d4)' },{ name:'Stan',role:'Lead Generation',fit:"Identifies high-value project opportunities and initiates warm introductions with developers and referral networks in your target market.",grad:'linear-gradient(135deg,#7c3aed,#3b82f6)' },{ name:'Penny',role:'SEO Blog Writer',fit:"Publishes editorial-quality design content that builds your search presence and positions your studio as the authority before a prospect picks up the phone.",grad:'linear-gradient(135deg,#f59e0b,#ec4899)' },{ name:'Linda',role:'Legal Assistant',fit:"Reviews client contracts, contractor agreements, and licensing terms before you sign. Catches scope-creep clauses, payment terms, and IP language.",grad:'linear-gradient(135deg,#3b82f6,#7c3aed)' }], pains:[{ before:"Drafting proposals takes half a day per prospect",after:"Eva produces a polished first draft from your brief in minutes" },{ before:"New project leads are inconsistent and reactive",after:"Stan runs proactive outreach to the right developers and referral contacts" },{ before:"Your work isn't searchable — leads come only by word of mouth",after:"Penny publishes regularly and builds an organic discovery channel" },{ before:"Client emails pile up while you're deep in a project",after:"Eva keeps correspondence on track without breaking your concentration" },{ before:"Contractor agreements reviewed under time pressure",after:"Linda flags risk clauses before you commit, every time" }] },
  };
  const p = map[slug];
  return `---
import VerticalPage from '../components/verticals/VerticalPage.astro';
---
<VerticalPage
  industry="${p.industry}"
  slug="${slug}"
  tagline="${p.tagline}"
  subhead="${p.subhead}"
  cta="${p.cta}"
  employees={${JSON.stringify(p.employees)}}
  pains={${JSON.stringify(p.pains)}}
/>
`;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAINTENANCE REDIRECT TEMPLATE
// ─────────────────────────────────────────────────────────────────────────────

const MAINTENANCE_INDEX = `---
import Maintenance from './maintenance.astro';
---
<Maintenance />
`;

const MAINTENANCE_REDIRECT = `---
import RedirectToMaintenance from '../layouts/RedirectToMaintenance.astro';
---
<RedirectToMaintenance />
`;

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function read(file) {
  try { return readFileSync(join(PAGES, file), 'utf8'); } catch { return ''; }
}

function write(file, content) {
  writeFileSync(join(PAGES, file), content, 'utf8');
}

function isMaintenanceMode() {
  return read('index.astro').includes('maintenance.astro');
}

function run(cmd) {
  try {
    execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
  } catch (err) {
    console.error(`\n❌  Command failed: ${cmd}`);
    process.exit(1);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SWITCH FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

function enableMaintenance() {
  console.log('\n🔧  Enabling maintenance mode…\n');
  write('index.astro', MAINTENANCE_INDEX);
  for (const file of Object.keys(LIVE).filter(f => f !== 'index.astro')) {
    write(file, MAINTENANCE_REDIRECT);
  }
  console.log('✓  Pages updated → maintenance');
}

function enableLive() {
  console.log('\n🚀  Enabling live mode…\n');
  for (const [file, content] of Object.entries(LIVE)) {
    write(file, content);
  }
  console.log('✓  Pages updated → live');
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

const arg = process.argv[2]?.toLowerCase();
const currently = isMaintenanceMode();

if (arg === 'status') {
  console.log(`\nCurrent mode: ${currently ? '🔧  MAINTENANCE' : '🚀  LIVE'}\n`);
  process.exit(0);
}

let goMaintenance;
if (arg === 'on')       goMaintenance = true;
else if (arg === 'off') goMaintenance = false;
else                    goMaintenance = !currently;   // toggle

if (goMaintenance === currently) {
  console.log(`\nAlready in ${currently ? 'maintenance' : 'live'} mode — nothing to do.\n`);
  process.exit(0);
}

if (goMaintenance) {
  enableMaintenance();
} else {
  enableLive();
}

// Build
console.log('\n📦  Building…\n');
run('npm run build');
console.log('✓  Build passed');

// Commit + push
const label = goMaintenance ? 'maintenance' : 'live';
const msg = goMaintenance
  ? 'chore: enable maintenance mode'
  : 'chore: disable maintenance mode — go live';

console.log('\n📤  Committing and pushing…\n');
run('git add .');
run(`git -c user.email="pdmelendez-hub@users.noreply.github.com" -c user.name="pdmelendez-hub" commit -m "${msg}"`);
run('git push');

console.log(`\n✅  Done! Site is now in ${label.toUpperCase()} mode.\n`);
console.log(`    Cloudflare will redeploy automatically within ~1 min.\n`);
