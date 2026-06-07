export type FaqTable = {
  headers: string[];
  rows: string[][];
};

export type FaqQuestion = {
  q: string;
  /**
   * Plain-text answer. Use \n\n for paragraph breaks. Lines starting with
   * "- " inside a paragraph become a bullet list. Lines starting with "1. ",
   * "2. ", etc become a numbered list. Tables go in the `table` field.
   */
  a: string;
  table?: FaqTable;
};

export type FaqCategory = {
  slug: string;
  title: string;
  blurb: string;
  questions: FaqQuestion[];
};

export const FAQ: FaqCategory[] = [
  {
    slug: 'general',
    title: 'What makes us different',
    blurb: 'Why BetweenReads, what it is, who it’s for',
    questions: [
      {
        q: 'What makes BetweenReads different?',
        a: 'BetweenReads is built on a simple belief — that readers deserve quality writing and serious writers deserve real readers. We also believe in a wholesome reading experience. The platform is driven by curation and reader participation. No advertising. No chasing algorithms. Just writing worth reading and readers worth writing for.\n\nAs readers and writers, we prize the experience and cherish our memories of physical book reading, the joy of discovery, staff picks, and quality content. We aim to replicate a quality browsing experience for readers.\n\nWhat makes BetweenReads distinctive:\n\nCurated Reading — We highlight Reader Picks and BetweenReads team picks to offer readers choice based on their reading interests.\n\nQuietReading Mode — We offer a distraction-free reading mode. When selected, we hold platform nudges, notifications, and new content from popping onto your radar. They await your return, silently, in notifications.\n\nVirtual Reading Club — Readers can host reading clubs for their favourite genre, author, or book and include any book — published, self-published, or emerging. Readers earn badges and are invited to recommend writers on the platform for Reader Picks.\n\nReader Pods — Writers invite up to 6 readers into an exclusive pod for deeper, more intimate conversation around their work. Not a public feed. A trusted inner circle.\n\nWriter Pods — Writers may form small groups of up to 4 writers. Kept deliberately small for meaningful craft conversations and peer support.\n\nSecureBetaReads — Manuscripts are protected on upload with watermarks and disabled copy. We never train AI on your content. We match readers to writers based on shared interests. Writers control exactly who reads their work and can revoke access at any time. Beta readers can only access your work on the platform. Beta readers who violate confidentiality and the terms of their agreement may be banned from the platform.\n\nSwap Credits — Readers earn credits by giving feedback. Writers earn credits by reading others. Credits unlock more of the platform — no cash required.\n\nEarly Discoverer — Readers who beta read a writer before they are published are permanently credited on that writer’s author page. Recognition that cannot be bought. Only earned.\n\nAgentReady — One place to build your agent list, generate tailored query letters, track submissions, and prepare for publication. Free to start. No tool-hopping.\n\nAuthor Page — Every writer on BetweenReads gets a generated author page with custom themes and templates. You can showcase all your works, self-published titles, and writing portfolio in one place. You can highlight your best writing for agents to find. You can build agent-ready bios for easy uploads to social media. You can list your book for sale. It is free and yours to customise.\n\nReader Page — Every reader on BetweenReads gets a generated reader page with custom themes and templates. You can showcase all your reading shelves, build reading lists — read and to be read — for published, unpublished, and self-published titles, list your favourite authors from any platform including newsletter writers, and manage your reading shelf in one place. It is free and yours to customise.\n\nIllustrator Page — Every illustrator on BetweenReads gets a dedicated page with full quality art display, style tags, commission availability, and storefront. Illustrated art is a first-class content category on BetweenReads — not a footnote to fiction. Standalone works, story illustrations, and journal submissions all have a home here.\n\nBetweenLines Journal — Each month the BetweenLines Journal curates the finest writing on the platform — reader picks, distinct voices, diverse genres — a wholesome literary magazine made for a quiet hour and a good cup of coffee. Readers encounter a variety of voices across genres, and writers may submit their work for consideration. Early Discoverer readers and Deep Thoughts readers may be invited to help screen selections before each issue.\n\nAudio — We offer audiobooks as well and provide authors services to turn their manuscripts into audiobooks.',
      },
      {
        q: 'What is BetweenReads?',
        a: 'BetweenReads is a platform for readers, writers, and illustrators of fiction for adults, young adults, and children. Readers discover emerging authors and original stories. Writers build a real readership, get beta feedback, and prepare for publication. Illustrators share their work, collaborate with writers, and get discovered by readers who love art as much as story. All in one place.',
      },
      {
        q: 'Who is BetweenReads for?',
        a: 'For readers who take fiction seriously and want to discover the next great voice before the rest of the world does. For writers who have developed their craft and want real readers, real feedback, and a clear path toward publication.',
      },
      {
        q: 'Is BetweenReads free to join?',
        a: 'Yes. Joining is free for both readers and writers.',
      },
      {
        q: 'When does the Inaugral issue launch?',
        a: 'Soon. Sign up for early access at betweenreads.com to be among the first to read.',
      },
      {
        q: 'Is BetweenReads available on mobile?',
        a: 'BetweenReads is fully optimised for mobile browsers at launch. A dedicated app is on the roadmap.',
      },
      {
        q: 'What languages are supported?',
        a: 'BetweenReads launches in English. Support for additional languages is on the roadmap. Works in other languages will be supported with an English translation approved by the author.',
      },
    ],
  },
  {
    slug: 'readers',
    title: 'For Readers',
    blurb: 'Free reads, credits, reading clubs',
    questions: [
      {
        q: 'Do I have to pay to read?',
        a: 'No. Reading is free. Every reader can read 3 pieces per month at no cost — one piece is one chapter, short story, poem, or illustration. For any single writer the first 3 pieces are free. Beyond that earn Reading Credits through feedback and beta reading to unlock more, or subscribe for $10 per month or $100 per year for unlimited reading which includes access to the monthly BetweenLines Journal.',
      },
      {
        q: 'What can I read for free?',
        a: '3 pieces per month across the platform. One chapter, one short story, one poem, or one illustration counts as one piece. Earn Reading Credits to unlock more or subscribe for unlimited access.',
      },
      {
        q: 'How do I read more?',
        a: 'You can earn Reading Credits by giving feedback — reacting, leaving quick comments, or writing deep thoughts on works you read. Credits never expire and can be spent to unlock more chapters of any work at a time.',
      },
      {
        q: 'What is the BetweenLines Journal Subscription?',
        a: 'For $10 per month or $100 annually, you get unlimited reading access, the monthly curated journal drop, and early access to new drops. You are eligible to be invited by a writer to join their Reader or Writer Pods. No ads. Just great fiction.',
      },
      {
        q: 'Can I use credits instead of paying?',
        a: 'Yes. Reading Credits earned through participation can be used to unlock chapters, beta reader access, and monthly features.',
      },
      {
        q: 'What kind of fiction is on BetweenReads?',
        a: 'We offer wholesome reading experiences for children, young adults, and adults. Literary fiction, commercial fiction, upmarket fiction, romance, fantasy, science fiction, thriller, historical fiction, horror, magical realism, and crossover genres like romantasy and literary thriller.',
      },
      {
        q: 'What kind of nonfiction is on BetweenReads?',
        a: 'We launch with fiction and will expand to include memoir, narrative nonfiction, and nonfiction across a variety of topics including finance, technology, science, and health. All nonfiction must meet the same quality standard as our fiction — proofread, developed, and original.',
      },
      {
        q: 'What formats can I read?',
        a: 'Microfiction (10–300 words), flash fiction (301–1,000 words), short stories, novelettes, novellas, novels (chapter by chapter), and poetry.',
      },
      {
        q: 'What is a Beta Reader?',
        a: 'Beta Readers opt in to read full manuscripts or chapters from writers seeking feedback before publication. They agree to provide in-depth feedback to a writer and become eligible to be invited to a writer’s Reader Pod. Beta Reading is free and earns you the most Swap Credits.',
      },
      {
        q: 'What is Early Discoverer status?',
        a: 'If you beta read a writer whose work goes on to be agented, shortlisted, or published — you are permanently credited as an Early Discoverer on that writer’s author page. It cannot be bought. Only earned.',
      },
      {
        q: 'What do active readers unlock beyond credits?',
        a: '',
        table: {
          headers: ['Reader Level', 'How You Get There', 'What You Unlock'],
          rows: [
            [
              'Early Discoverer',
              'Beta read a writer who gets agented or published',
              'Permanent credit on writer’s author page; invited to screen Journal selections',
            ],
            [
              'Deep Thoughts Reader',
              'Consistently leave Deep Thoughts feedback',
              'Invited to screen Journal selections before each issue',
            ],
          ],
        },
      },
      {
        q: 'What are Reader Pods?',
        a: 'Writers may invite a select group of readers to join exclusive Reader Pods of up to 6 readers at a time to deepen the interaction and experience with their reader base.',
      },
      {
        q: 'How do virtual book clubs work?',
        a: 'Book clubs on BetweenReads are small groups of readers formed around a shared work or genre. Members read together, share reactions, leave comments, and discuss in a private group thread. Reading clubs are free to join. You can join an existing club or start your own with a minmum of four readers.',
      },
      {
        q: 'Can I follow a writer and get notified when they upload new chapters?',
        a: 'Yes. You can follow any writer on BetweenReads and receive notifications when they upload new chapters, new works, or announce publication milestones. Following is free for all readers.',
      },
      {
        q: 'How do children’s profiles work on BetweenReads?',
        a: 'BetweenReads follows a family profile model similar to industry standards.\n\nUnder 13 — parent creates profile. A parent or guardian creates the account and adds a child profile. The child reads only within the Children’s Fiction category. Adult and Young Adult content is invisible to children’s profiles. Parents control access with a PIN. This meets COPPA requirements — the parent is the account holder.\n\n13–17 — self signup with parent consent. Young adults can sign up directly by entering their date of birth. A parent or guardian email is required for consent. The profile is automatically created as a Young Adult profile — with access to Young Adult and Children’s content. Adult content remains blocked.\n\n18+ — self signup. Adults self-declare their age on signup by confirming: “I confirm that I am over 18 and an adult. If found in violation I accept that I will be banned from this platform.” No further verification is required.',
      },
      {
        q: 'How is children’s content labelled?',
        a: 'All children’s fiction is clearly tagged and categorised by writers on upload — just like a bookstore’s children’s section. Our editorial team verifies the tag is appropriate. Children’s profiles only see content tagged for their age group.',
      },
      {
        q: 'Are there ads on children’s profiles?',
        a: 'No. There are no ads anywhere on BetweenReads — for any age group. Ever.',
      },
      {
        q: 'How do I earn Reading Credits?',
        a: '',
        table: {
          headers: ['Action', 'Reading Credits'],
          rows: [
            ['React to a piece', '2 credits'],
            ['Quick comment', '5 credits'],
            ['Deep thoughts feedback', '10 credits'],
            ['Partial manuscript beta read', '25 credits'],
            ['Full manuscript beta read', '50 credits'],
          ],
        },
      },
      {
        q: 'How do I spend Reading Credits?',
        a: '',
        table: {
          headers: ['Feature', 'Reading Credits'],
          rows: [
            ['Unlock 1 more piece', '5 credits'],
            ['1 month Journal Subscription', '50 credits'],
          ],
        },
      },
      {
        q: 'Do credits expire?',
        a: 'No. Credits never expire.',
      },
    ],
  },
  {
    slug: 'beta-readers',
    title: 'For Beta Readers',
    blurb: 'Feedback, credits, Early Discoverer',
    questions: [
      {
        q: 'What is a beta reader?',
        a: 'A beta reader reads a writer’s unpublished manuscript — chapters or a full work — and gives structured feedback before it is submitted to agents, journals, or contests. Beta readers are the writer’s first real audience. Their feedback shapes the book while it is still forming.',
      },
      {
        q: 'Do I need any special qualifications to be a beta reader?',
        a: 'No. You need to be a reader who reads carefully and responds honestly. You choose the genres you read. You choose the feedback style that suits you — a one-tap reaction, a quick comment, or deep thoughts. No writing experience required.',
      },
      {
        q: 'Is beta reading free?',
        a: 'Yes. Beta reading is free. You earn Swap Credits for every piece of feedback you give — credits that unlock more reading on the platform.',
      },
      {
        q: 'How do I become a beta reader?',
        a: 'When you sign up as a reader you can opt in to beta reading. You select your preferred genres, formats, and feedback style. BetweenReads matches you with writers whose work fits your preferences.',
      },
      {
        q: 'What do I have to read?',
        a: 'Every beta read on BetweenReads is a minimum of 3 chapters or 5,000 words — whichever comes first. You can also opt in to read full manuscripts. You choose what you commit to.',
      },
      {
        q: 'What kind of feedback can I give?',
        a: 'React — emoji reaction plus 1–5 star ratings on Plot, Characters, Pacing, Writing, and Emotional Resonance. Plus: Would you keep reading? Would you buy this book? Earns 2 credits.\n\nQuick Comment — 1 to 3 sentences on what worked, what didn’t, what stood out. Earns 5 credits.\n\nDeep Thoughts — open text or voice note. Write or record as much as you like. Earns 10 credits.',
      },
      {
        q: 'What happens after I beta read — does the writer see my feedback?',
        a: 'Yes. All feedback you give as a beta reader is shared directly with the writer. They see your reactions, quick comments, and deep thoughts. Your display name is shown unless you choose to give feedback anonymously. Writers cannot respond publicly to your feedback but can thank you privately. They can only message you if you’ve enabled direct messages in settings.',
      },
      {
        q: 'What is the Early Discoverer credit?',
        a: 'If you beta read a writer whose work goes on to be agented, shortlisted for a prize, or traditionally published — you are permanently credited as an Early Discoverer on that writer’s author page. It cannot be bought. Only earned.',
      },
      {
        q: 'How do Swap Credits work — can I exchange beta-reads?',
        a: 'Yes. Every time you give a beta-read on the platform you earn Swap Credits. Readers earn them too — and so do writers who read other writers’ drafts.\n\nCredits never expire. You can spend them on getting a beta-read of your own manuscript, on a month of the Journal subscription, or on AgentReady Pro time. The whole point is that active participation funds your own progress — no cash required.\n\nThe loop is simple: read someone else’s work carefully, leave the kind of feedback you’d want yourself, and the credits land in your account. When you’re ready to send your draft into the room, those credits unlock the readers you need.',
      },
      {
        q: 'Am I committing to read the whole manuscript?',
        a: 'You commit to reading the minimum — 3 chapters or 5,000 words — and giving feedback within the writer’s requested timeframe. Reading further is your choice. If you cannot complete a beta read you can notify the writer through the platform.',
      },
      {
        q: 'Is the manuscript I beta read confidential?',
        a: 'Yes. By opting in to beta reading you agree to a confidentiality commitment. The work you read is unpublished and protected. You may not share, reproduce, or distribute any part of it.',
      },
    ],
  },
  {
    slug: 'writers',
    title: 'For Writers',
    blurb: 'Upload, copyright, AgentReady, Swap Credits',
    questions: [
      {
        q: 'Do I have to pay to write?',
        a: 'No. Writing is free. You can write or upload your work in any format and genre enabled on the platform — from microstories to novels. We ask that you upload the minimum length for your chosen genre and format to enable a quality reading experience.\n\nFor novelettes, novellas, and novels, your work becomes visible to readers once you have uploaded a minimum of 5,000 words. Writers also get 3 free reads per month — each read is the first 3 chapters of any work available as a free read. Writers who upload a minimum of 5,000 words unlock 2 additional free reads per month.\n\nYou can earn Swap Credits through feedback and beta reading to unlock more chapters without ever paying. If your work is selected for the journal you receive that month’s issue free. You can also order a print copy of the BetweenLines Journal on demand at an additional cost.',
      },
      {
        q: 'Is it free to upload my work?',
        a: 'Yes. Uploading your work, building your author page, and accessing SecureBetaReads is completely free.',
      },
      {
        q: 'Who can upload to BetweenReads?',
        a: 'Writers with a developed body of work. Emerging writers with a minimum of one piece of writing that meets our format standards. Longlisted and shortlisted writers. Self-published and traditionally published authors.',
      },
      {
        q: 'What standard does my writing need to meet?',
        a: 'BetweenReads is a platform for quality writing. We provide built-in proofreading and grammar tools to help you get your work ready. You can keep your draft in any condition you like — that is your business. But your work will only be shared with readers once it meets our quality standard:\n\nClean and proofread — free of spelling errors, grammatical mistakes, and typographical issues.\n\nRevised and developed — not a raw first draft; work that has been shaped and considered.\n\nOriginal — entirely your own writing, in English, complete or properly structured as a serialised chapter.\n\nOur tools help you get there. The standard protects our readers — and your reputation as a writer.',
      },
      {
        q: 'What formats can I upload?',
        a: '',
        table: {
          headers: ['Format', 'Word Count'],
          rows: [
            ['Microfiction', '10–300 words'],
            ['Flash Fiction', '301–1,000 words'],
            ['Short Story', '1,001–7,500 words'],
            ['Novelette', '7,501–17,500 words'],
            ['Novella', '17,501–40,000 words'],
            ['Novel', '40,001–200,000 words'],
            ['Poetry', '1 poem or collection'],
          ],
        },
      },
      {
        q: 'Can I upload chapters as I write or do I need a complete manuscript?',
        a: 'You do not need a complete manuscript to join. You can upload chapter by chapter as you write and readers can follow your work in progress. The minimum upload for beta reading is 3 chapters or 5,000 words — whichever comes first. For poetry, a minimum of 1 poem is required to upload. We recommend uploading at least 3 poems to give readers and beta readers a meaningful sense of your voice and body of work.',
      },
      {
        q: 'Can I write under a pen name?',
        a: 'Yes. Your display name can be your pen name. Your legal name is only used for account verification and payment purposes and is never shown publicly.',
      },
      {
        q: 'Do I keep my copyright?',
        a: 'Yes. Always. BetweenReads never claims any rights over your work. You own everything you upload.',
      },
      {
        q: 'What rights do I give BetweenReads?',
        a: 'By uploading your work to BetweenReads you grant us first serial rights to publish your work digitally on the platform. All rights revert to you upon publication. You retain full copyright at all times.\n\nBy uploading you also agree to three additional things:\n\n1. Platform reading rights. Your first three chapters or a minimum of 5,000 words — whichever comes first — will be available for readers to read on BetweenReads.\n\n2. Promotional rights. BetweenReads may use short excerpts from your work for promotional purposes — on the platform, in marketing materials, and on social media. We will always credit you as the author. Non-exclusive and royalty-free.\n\n3. Optional — Journal submission. By submitting your work to the BetweenLines Journal you grant us first serial rights upon acceptance to publish your work digitally on the platform and in the journal issue. All rights revert to you upon publication. If your work is subsequently published or reprinted elsewhere, please credit BetweenLines as the original publisher. You retain full copyright at all times.\n\nAll rights are non-exclusive. You are always free to publish your work elsewhere.',
      },
      {
        q: 'Can I submit previously published work?',
        a: 'Yes. BetweenReads welcomes previously published work. We ask only that you confirm the rights are yours to grant and that proper attribution is provided where required — for example crediting a previous publisher if first serial rights were held by them. Please note that if your work was previously published elsewhere, first serial rights no longer apply and we will publish it as a reprinted work.',
      },
      {
        q: 'What if I am a self-published author?',
        a: 'You are very welcome on BetweenReads. You can share excerpts from your published titles to introduce your work to new readers. We ask that you confirm the rights are yours to share and provide proper attribution. Your author page can list your published titles and link to your existing storefronts so readers can find your full catalogue. You may also list your works directly on the BetweenReads storefront.',
      },
      {
        q: 'What is SecureBetaReads?',
        a: 'SecureBetaReads is our manuscript protection and beta reading feature. Your work is protected when uploaded. You are matched with human beta readers. You receive structured feedback — from emoji reactions to deep thoughts. Beta reading of your first three chapters is free. For additional chapters, upgrade to a SecureBetaReads plan or use Swap Credits.',
      },
      {
        q: 'Do I pay as a writer?',
        a: 'Your first three chapters of beta reading are free. For full manuscript beta reading you can either upgrade to a SecureBetaReads plan or use Swap Credits earned through reading and giving feedback on other writers’ work. Swap Credits never expire and can be accumulated over time — meaning active readers and writers can access full beta reading at no cash cost. AgentReady is free to start — build your agent list, track queries, and access standard templates at no cost. AgentReady Pro is a paid upgrade for writers ready to use AI-powered matching, query generation, and full submission workflow.',
      },
      {
        q: 'What are Swap Credits for writers?',
        a: 'Writers earn Swap Credits by beta reading other writers’ work through AuthorSwap. Credits can be used to unlock AgentReady Pro, weWrite, or additional beta reader slots. Credits never expire.',
      },
      {
        q: 'What happens to beta feedback I receive?',
        a: 'All beta feedback is private to you by default. You can choose to make feedback public on your author page or keep it hidden. You can thank beta readers privately via messages delivered directly to their inbox. Unless a reader has opted in to messages, you may not send a direct message to a reader without their consent.',
      },
      {
        q: 'What are Writer Pods?',
        a: 'Writers may form a small group of up to 4 writers at a time to deepen the interaction and experience with other writers in their genre. The number is kept small to offer more meaningful conversations around writing.',
      },
      {
        q: 'What is AgentReady?',
        a: 'AgentReady is our submission preparation tool. The free tier lets you build your agent list, upload your own CSV, track query status, and access standard industry templates. AgentReady Pro adds AI-powered agent matching, tailored query letter generation, synopsis and pitch writing, real-time agent open/closed status, and submission tracking. We track trends so you don’t have to.',
      },
      {
        q: 'How is BetweenReads different from MSWL and QueryTracker?',
        a: 'QueryTracker and MSWL are genuinely useful tools and BetweenReads respects what they do. QueryTracker lets you search agents, track your query status, and manage your submission dashboard — for agents in their database. MSWL surfaces what agents are actively looking for. Both are free or low cost and serious writers already use them. AgentReady goes further — searching beyond their databases to surface agents from agency websites, Publisher’s Marketplace, and other sources. AgentReady then helps you write tailored query letters, synopses, cover letters, and pitches for each submission. The research and the writing in one place. If you already use QueryTracker you can import your agent list directly into AgentReady and pick up from there.',
      },
      {
        q: 'How is BetweenReads different from Scrivener, ProWritingAid, or Word?',
        a: 'Scrivener, ProWritingAid, and Word are writing and editing tools. They help you write and polish your manuscript. BetweenReads picks up where those tools end. Once your draft is ready, BetweenReads connects you with early readers, gives you structured beta feedback, helps you find agents, and builds your audience before your book is published. Your writing tools are the workshop. BetweenReads is the door out of it.',
      },
      {
        q: 'How is BetweenReads different from Substack or Medium?',
        a: 'Substack and Medium are excellent platforms for building a readership around newsletters, essays, and opinion writing. Many writers have built substantial audiences there. But neither platform is designed for pre-published fiction and nonfiction that authors may sell traditionally or via self-publishing. Both platforms are made for writers, not readers. BetweenReads is tailored for a wholesome reading experience and genuine engagement with authors. Writers can serialise books chapter by chapter, lock chapters, seek beta reading, protect manuscripts, prepare to submit for traditional publishing with reader feedback, use an agent submission workflow, and benefit from editorial curation around fiction and nonfiction genres. Readers on Substack and Medium come for ideas and commentary — not story.',
      },
      {
        q: 'What is my Author Page?',
        a: 'Every writer on BetweenReads gets a generated author page with custom themes and templates. You can showcase all your works, self-published titles, and writing portfolio in one place. You can highlight your best writing for agents to find. You can build agent-ready bios for easy uploads to social media. You can list your book for sale. It is free and yours to customise.',
      },
      {
        q: 'What are the writer profile tiers?',
        a: 'Emerging Author — unpublished writers with a developed body of work.\n\nPublished Author — traditionally published, agented, or prize-listed writers (verified).\n\nSelf-Published Author — independently published writers (verified).',
      },
      {
        q: 'What writer badges can I earn?',
        a: '',
        table: {
          headers: ['Badge', 'How Earned'],
          rows: [
            ['Award Winner', 'Won a recognised literary prize — verified by platform'],
            ['Shortlisted', 'Shortlisted for a recognised literary prize — verified by platform'],
            ['Longlisted', 'Longlisted for a recognised literary prize — verified by platform'],
            ['BetweenLines Pick', 'Work selected by the BetweenReads editorial team for the Journal or platform feature'],
            ['Read Here First', 'Work debuted on BetweenReads before publication anywhere else'],
            ['Early Discovery', 'Your work was beta read by readers before you were published, agented, or prize-listed'],
            ['Verified Emerging', 'Emerging author with a developed body of work on the platform'],
            ['Verified Published', 'Traditionally published or agented — verified by platform'],
            ['Verified Self-Published', 'Independently published — verified by platform'],
            ['Reader Favourite', 'Consistently high React and Deep Thoughts scores across your work'],
          ],
        },
      },
      {
        q: 'How can I earn as a writer?',
        a: 'You earn Swap Credits by beta reading other writers’ work. Credits can be spent on AgentReady Pro, weWrite, and other platform features to reduce your costs. Credits never expire.',
      },
      {
        q: 'How do I earn Swap Credits?',
        a: '',
        table: {
          headers: ['Action', 'Swap Credits'],
          rows: [
            ['Beta read partial manuscript', '25 credits'],
            ['Beta read full manuscript', '50 credits'],
          ],
        },
      },
      {
        q: 'How do I spend Swap Credits?',
        a: '',
        table: {
          headers: ['Feature', 'Swap Credits'],
          rows: [
            ['1 month Journal Subscription', '50 credits'],
            ['1 month AgentReady Pro', '100 credits'],
          ],
        },
      },
      {
        q: 'Are there other ways to earn?',
        a: 'Sell your book — You may choose to list your book on the BetweenReads storefront. You keep 80% of every sale. BetweenReads takes 20%. Entirely optional. You can also list links to your other storefronts on your author page to help readers find your full catalogue. You retain full copyright always.\n\nBe featured in the BetweenLines Journal — If your work is selected for the BetweenLines Journal you will receive a nominal payment based on new journal subscriptions acquired that month. For example if 5 new readers subscribe to the $10 monthly plan that includes the journal, a share of that revenue is distributed among the writers featured in that issue after platform costs are covered.\n\nEarn a referral fee — Refer readers to the platform for a 10% referral fee when the reader purchases an annual or monthly plan for three months.',
      },
      {
        q: 'How else can my writing reach audiences?',
        a: 'You can submit your work to the monthly BetweenLines Journal for a small entry fee of $2. The journal is curated by our editorial team and distributed to all eligible readers online. Readers may also recommend your work for journal consideration — for free.',
      },
      {
        q: 'How do I get selected for the journal?',
        a: 'The BetweenLines editorial team reads submissions and selects works for each issue. You can submit your work to the journal for a small entry fee when the journal launches. Selection is based entirely on quality and editorial fit — not platform metrics or popularity. Readers may also recommend a writer or their work for inclusion — for free.',
      },
      {
        q: 'How do I get featured on the platform?',
        a: 'The editorial team selects featured works based on quality, reader response, and editorial judgment. AI assists the team in surfacing gems that might otherwise be missed. There is no paid placement. You cannot buy a feature. Quality is the only criterion.',
      },
      {
        q: 'How do I get matched with beta readers?',
        a: 'When you upload your work and opt in to SecureBetaReads, BetweenReads matches you with readers who have selected your genre and format preferences. At launch matching is open — as the platform grows matching becomes more refined by genre, reading history, and feedback quality.',
      },
      {
        q: 'How long does beta reading take?',
        a: 'That depends on the reader and the length of your work. Readers set their own reading pace. You can set a preferred feedback window when you upload — for example two weeks for a full manuscript. Readers who commit to a beta read agree to respond within your requested timeframe.',
      },
      {
        q: 'What happens if someone plagiarises my work?',
        a: 'Your manuscript is protected on upload via SecureBetaReads. Beta readers agree to confidentiality terms before accessing your work. If you believe your work has been plagiarised or misused report it immediately via our content team. We take plagiarism seriously and will investigate all reports. Repeat offenders will be permanently removed from the platform.',
      },
      {
        q: 'Can I remove my work at any time?',
        a: 'Yes. You can remove your work from BetweenReads at any time. Once removed it will no longer be visible to readers. Any beta reads or feedback already received remain in your account for your reference. Promotional excerpts already published will be removed within a reasonable timeframe.',
      },
      {
        q: 'Can I export my written work?',
        a: 'Yes. You can export all your written work from BetweenReads at any time in standard file formats. Your writing is always yours to take with you. We do not lock you in.',
      },
      {
        q: 'What is weWrite?',
        a: 'weWrite is our collaborative storytelling feature — coming soon. Up to 4 writers collaborate on one story with gamified handoffs, timers, and turns. Completed stories go into the weWrite library. Revenue is split equally among contributors. Joint copyright applies to all. weWrite costs $10/month or is available at $5/month when bundled with AgentReady Pro.',
      },
    ],
  },
];
