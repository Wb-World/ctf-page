export type Difficulty = 'BEGINNER' | 'EASY' | 'MEDIUM' | 'HARD' | 'INSANE';
export type Category = 'Web Exploitation' | 'Cryptography' | 'Reverse Engineering' | 'Forensics' | 'OSINT' | 'Steganography' | 'Binary Basics' | 'AI Security';

export interface Challenge {
    id: string;
    title: string;
    category: Category;
    points: number;
    difficulty: Difficulty;
    story: string;
    description: string;
    flag: string;
    hints: string[];
    learningConcept?: {
        title: string;
        explanation: string;
    };
    solves?: number;
    attachments?: string[];
    tags?: string[];
}

export const CHALLENGES: Challenge[] = [
    // --- WEB EXPLOITATION ---
    {
        id: 'web-1',
        title: 'Hidden Comment',
        category: 'Web Exploitation',
        points: 50,
        difficulty: 'BEGINNER',
        story: 'A corporate intranet portal was deployed hastily before a product launch. The dev team left debugging artifacts in the build. Your job is to recover what they forgot to clean up.',
        description: 'The target page at /portal renders a standard login form. Somewhere within the static markup, a legacy credential was left behind during development. Recover the flag without authenticating.',
        flag: 'FLAG{v1s1bl3_html_m4rkup}',
        hints: [
            'Browsers render HTML — they don\'t show everything they receive.',
            'Developers communicate with each other through the source.',
            'What keyboard shortcut lets you read what the browser doesn\'t display?'
        ],
        learningConcept: {
            title: 'HTML Source Inspection',
            explanation: 'Browsers parse and render HTML, hiding raw markup from view. Right-clicking → View Source or Ctrl+U reveals the unrendered document including developer comments, hidden inputs, and embedded data not visible on screen.'
        },
        solves: 1242,
        tags: ['recon', 'html', 'passive']
    },
    {
        id: 'web-2',
        title: 'Local Secrets',
        category: 'Web Exploitation',
        points: 150,
        difficulty: 'EASY',
        story: 'You\'ve been handed access to a staging environment of a fintech SPA. The app performs all auth client-side and claims tokens are "safely stored". Prove them wrong.',
        description: 'The application stores a session token after login. No network interception is needed — everything is accessible through browser tooling. Find the stored credential and extract the embedded flag from its payload. The token uses a well-known web encoding scheme for its claims.',
        flag: 'FLAG{l0c4lst0r4g3_h1j4ck}',
        hints: [
            'Modern browsers expose client-side storage under a specific DevTools panel.',
            'Session tokens often encode structured data — the encoding is reversible without a key.',
            'The flag may be base64-encoded inside the token payload.'
        ],
        solves: 894,
        tags: ['client-side', 'storage', 'jwt']
    },
    {
        id: 'web-3',
        title: 'JWT Tamper',
        category: 'Web Exploitation',
        points: 300,
        difficulty: 'MEDIUM',
        story: 'A REST API uses JWT for authorization. The security team boasts their tokens are "signed and immutable". Intercept, analyze, and subvert the token to escalate your privileges.',
        description: 'The /api/profile endpoint returns user data based on the JWT in the Authorization header. The server validates the signature but has a misconfiguration in its algorithm handling. Forge a token with admin:true in the payload and retrieve the admin-only flag from /api/admin/flag.',
        flag: 'FLAG{jwt_manipulation_master}',
        hints: [
            'What happens when the algorithm field in the JWT header is set to a value that doesn\'t require a secret?',
            'Inspect what the server actually validates — not what you assume it validates.',
            'RFC 7519 defines multiple signing algorithms — not all of them are asymmetric.'
        ],
        solves: 432,
        tags: ['jwt', 'auth-bypass', 'api']
    },
    {
        id: 'web-4',
        title: 'IDOR Access',
        category: 'Web Exploitation',
        points: 400,
        difficulty: 'HARD',
        story: 'A SaaS portal exposes user-specific documents via a REST endpoint. The access control is enforced entirely on the frontend. You are authenticated as user #1048. Target: retrieve the document belonging to the privileged service account.',
        description: 'GET /api/v2/documents/{doc_id} returns documents. Your user has access to doc IDs in a specific range. The privileged account\'s doc ID is not sequential — you\'ll need to enumerate a parameter space or observe patterns in how the application constructs document references. A secondary endpoint at /api/v2/users/me leaks partial metadata that may help reconstruct the target ID. Watch the full request lifecycle — headers matter.',
        flag: 'FLAG{br0k3n_4cc3ss_c0ntr0l_pwn}',
        hints: [
            'The document ID is not a simple integer — examine its structure carefully.',
            'What does the /me endpoint reveal that might be reused elsewhere in the API surface?',
            'Access control decisions made only in the browser are enforced nowhere that matters.'
        ],
        solves: 156,
        tags: ['idor', 'bac', 'api', 'enumeration']
    },

    // --- CRYPTOGRAPHY ---
    {
        id: 'cry-1',
        title: 'Base64 Intro',
        category: 'Cryptography',
        points: 50,
        difficulty: 'BEGINNER',
        story: 'An intercepted configuration file contains what appears to be an encoded string. The format is standard, widely used in web protocols, and entirely reversible.',
        description: 'Decode the following string to recover the flag: RkxBR3tiYXNlNjRfZTEwMX0=\n\nNote: This is an encoding scheme, not encryption. No key is required.',
        flag: 'FLAG{base64_e101}',
        hints: [
            'The = character at the end is a structural indicator of the encoding format.',
            'This encoding maps every 3 bytes of binary data to 4 printable ASCII characters.',
            'Any standard library or online converter can handle this — identify the scheme first.'
        ],
        learningConcept: {
            title: 'Base64 Encoding',
            explanation: 'Base64 encodes binary data as ASCII text using a 64-character alphabet. It is NOT encryption — there is no key and no security. It appears in HTTP headers, JWTs, email attachments, and data URIs. Padding characters (=) align the output to multiples of 4.'
        },
        solves: 2102,
        tags: ['encoding', 'base64', 'beginner']
    },
    {
        id: 'cry-2',
        title: 'Caesar Cipher',
        category: 'Cryptography',
        points: 100,
        difficulty: 'EASY',
        story: 'A threat actor left an encoded message in a public paste. The cipher is historical and trivially broken — but only if you know what to look for. The shift value is embedded in the ciphertext itself.',
        description: 'Decrypt the following ciphertext. The cipher substitutes each letter with one a fixed number of positions away in the alphabet. The shift is not 13. Frequency analysis or systematic brute-force will work, but the correct plaintext will be grammatically coherent.\n\nCiphertext: YETX{vtljtk_vzgytk_tqtekw}',
        flag: 'FLAG{caesar_cipher_cracked}',
        hints: [
            'The flag format is FLAG{...} — use that structure to determine the shift without brute-forcing.',
            'Not all 25 possible shifts produce readable English — but you need to verify each one.',
            'The shift is a single-digit number less than 10.'
        ],
        solves: 1540,
        tags: ['classical', 'substitution', 'frequency-analysis']
    },
    {
        id: 'cry-3',
        title: 'XOR Bitwise',
        category: 'Cryptography',
        points: 300,
        difficulty: 'MEDIUM',
        story: 'A binary protocol was captured in transit. The data stream is XOR-encrypted with a repeating key. You have the ciphertext — and you know the plaintext starts with a predictable header.',
        description: 'The following hex stream is encrypted with a repeating XOR key of unknown length (between 1–8 bytes). The plaintext begins with "FLAG{". Use this known-plaintext to recover the key, then decrypt the full message.\n\nCiphertext (hex): 2D 29 28 20 10 03 12 17 4B 1A 0E 1A 19 0D 03 11\n\nOutput the key and the full decrypted flag.',
        flag: 'FLAG{x0r_m4st3r_2026}',
        hints: [
            'XOR is its own inverse: if C = P ^ K, then K = P ^ C.',
            'The first 5 bytes of plaintext are known — use them to extract the first 5 bytes of the key.',
            'If the key repeats, the full key can be recovered from a partial known-plaintext segment.'
        ],
        solves: 621,
        tags: ['xor', 'known-plaintext', 'stream-cipher']
    },
    {
        id: 'cry-4',
        title: 'Multi-Cipher',
        category: 'Cryptography',
        points: 500,
        difficulty: 'INSANE',
        story: 'A nation-state actor encrypted their dead-drop communication using a layered scheme. The outer encoding is known; the inner cipher uses a custom alphabet derived from a passphrase. The passphrase itself is buried in metadata of a decoy file distributed on the same channel.',
        description: 'You\'re given a multi-layer ciphertext:\n\nLayer 1: U0VORXtlMGlfMTNfZzBiNTZfbzRiNn0=\n\nLayer 2 (after L1 decode): The result is encoded with a shift cipher where the key is derived from a SHA1 hash. The first 2 hex characters of SHA1("cyberai") give you the shift value as a decimal integer.\n\nRecover the final plaintext flag. You must compute the hash yourself — no hints on the passphrase.',
        flag: 'FLAG{r0t_13_b4s64_c0mb0}',
        hints: [
            'Layer 1 is a standard web encoding — identify it by its character set and padding.',
            'Hashing functions are deterministic — the same input always yields the same output.',
            'The shift value is derived, not guessed. Work the math before attempting decryption.'
        ],
        solves: 78,
        tags: ['multi-layer', 'hashing', 'custom-cipher', 'scripting']
    },

    // --- REVERSE ENGINEERING ---
    {
        id: 'rev-1',
        title: 'Simple JS Rev',
        category: 'Reverse Engineering',
        points: 100,
        difficulty: 'EASY',
        story: 'A client-side validation script was deployed to "protect" a flag. The developer believed minification was equivalent to security. The logic is intact — just obscured.',
        description: 'The following minified JavaScript validates a user input and reveals the flag if correct. Reverse-engineer the validation logic to determine what input produces a truthy result, or extract the flag directly from the obfuscated code without executing it.\n\nTarget: `(function(_0x3a2f,_0x1b4e){var _0x2c1d=function(_0x5f3a){while(--_0x5f3a){_0x3a2f[\'push\'](_0x3a2f[\'shift\']())}};_0x2c1d(++_0x1b4e)}(["0b","%7d","63","73","74","5f","6a","70","77","6e","33","64","46","4c","41","47","7b"],0x69));`\n\nTrace the array rotation, convert each hex value to ASCII, and reconstruct the flag.',
        flag: 'FLAG{0bfusc4t3d_js_pwn3d}',
        hints: [
            'The array undergoes a fixed number of rotation operations — simulate them.',
            'Each element is a 2-character hex string — what does that represent?',
            'Concatenate the final array values in order after all transformations complete.'
        ],
        solves: 781,
        tags: ['javascript', 'obfuscation', 'deobfuscation', 'static']
    },
    {
        id: 'rev-2',
        title: 'Binary Strings',
        category: 'Reverse Engineering',
        points: 200,
        difficulty: 'MEDIUM',
        story: 'You captured a suspicious ELF binary from a compromised IoT device. The binary phone homes on execution. Before running it in a sandboxed environment, perform static analysis to recover intelligence.',
        description: 'The 32-bit ELF binary `sensor_agent` was extracted from a compromised device. Without executing it, perform static analysis to recover all embedded plaintext strings. The flag is present but partially obscured by a null-byte split across two adjacent memory regions. You\'ll need to identify both fragments and reconstruct the full flag.\n\nTools like `strings`, `xxd`, or a disassembler may be required. The binary is available for download.',
        flag: 'FLAG{strings_r_useful}',
        hints: [
            'The `strings` command has minimum-length thresholds — try different values.',
            'If a string is split by non-printable bytes, raw hex output will reveal both parts.',
            'Look for sequences matching the FLAG{ pattern across a hex dump.'
        ],
        solves: 412,
        tags: ['elf', 'static-analysis', 'strings', 'binary']
    },
    {
        id: 'rev-3',
        title: 'Assembly Logic',
        category: 'Reverse Engineering',
        points: 350,
        difficulty: 'HARD',
        story: 'A crackme binary was found on a CTF server. It accepts a password and exits silently if wrong. Your goal: determine the exact input that causes the binary to print the flag — without debugging at runtime.',
        description: 'The x86-64 binary `crackme_v3` compares your input against a computed value using the following core logic (pseudocode from decompilation):\n\n```\nfor i in 0..len(input):\n    if (input[i] XOR 0x42) != expected[i]: fail()\n```\n\n`expected[]` = { 0x04, 0x2C, 0x2D, 0x6A, 0x5B, 0x27, 0x75, 0x31, 0x71, 0x05, 0x71, 0x2C }\n\nRecover the input string. Then submit it as FLAG{<your_input>}.',
        flag: 'FLAG{cr4ckm3_1337}',
        hints: [
            'XOR is its own inverse — apply the same operation to recover the plaintext.',
            'Work byte by byte: what value XORed with 0x42 gives 0x04?',
            'The recovered string is human-readable ASCII — if it\'s not, re-check your XOR operand.'
        ],
        solves: 121,
        tags: ['crackme', 'xor', 'x86', 'reversing']
    },
    {
        id: 'rev-4',
        title: 'Malware Sandbox',
        category: 'Reverse Engineering',
        points: 500,
        difficulty: 'INSANE',
        story: 'A packed PE binary was uploaded to an internal threat feed. Initial sandboxing showed suspicious network behavior before the process self-terminated. Static analysis is complicated by a multi-stage unpacking routine. You need to extract the C2 domain without triggering the execution environment.',
        description: 'The binary `loader.exe` uses a 3-stage unpacking routine:\n- Stage 1: XOR decodes a second-stage shellcode blob using a 4-byte key derived from the PEB\'s NtGlobalFlag\n- Stage 2: Shellcode resolves API hashes to locate WinSock functions\n- Stage 3: Connects to a hardcoded C2 domain embedded in the second stage\'s .data section\n\nPerform static unpacking to extract the C2 domain. The flag is FLAG{<c2_domain_without_TLD>}.\n\nAPI hash values, unpacking key derivation logic, and shellcode offsets are embedded in the binary. A disassembler and scripting environment are required.',
        flag: 'FLAG{cnc_server_found_2026}',
        hints: [
            'The unpacking key depends on an in-memory structure — research the PEB layout.',
            'API hashing is a common anti-analysis technique — look for known hash algorithms (djb2, ROR13).',
            'After stage 2 resolves, the C2 string is in cleartext within the unpacked shellcode blob.'
        ],
        solves: 32,
        tags: ['malware', 'unpacking', 'shellcode', 'pe', 'anti-analysis']
    },

    // --- FORENSICS ---
    {
        id: 'for-1',
        title: 'Magic Bytes',
        category: 'Forensics',
        points: 150,
        difficulty: 'EASY',
        story: 'An image file was exfiltrated from a breach and its header was corrupted to prevent analysis. The rest of the file is intact. Restore it.',
        description: 'The file `evidence.jpg` fails to open in any image viewer. Hex analysis reveals the first 4 bytes were overwritten with 00 00 00 00. The remainder of the file is structurally intact. Restore the correct file signature, open the image, and read the flag embedded in it.\n\nYou must determine the correct JPEG magic bytes from external reference — they are not provided here.',
        flag: 'FLAG{m4g1c_byt3s_f1x3d}',
        hints: [
            'Every binary file format begins with a unique byte sequence — look it up for JPEG.',
            'A hex editor allows you to modify arbitrary bytes in a file without corrupting the rest.',
            'The file extension matches the intended format — use it to identify the correct signature.'
        ],
        solves: 890,
        tags: ['file-format', 'hex-editing', 'magic-bytes']
    },
    {
        id: 'for-2',
        title: 'EXIF Extraction',
        category: 'Forensics',
        points: 200,
        difficulty: 'MEDIUM',
        story: 'A whistleblower uploaded an image to a public forum without realizing it contained embedded location data. Your team needs to extract the GPS coordinates and cross-reference them to identify the location — the flag is encoded in the GPS altitude field as a decimal integer.',
        description: 'The image `location.jpg` was posted publicly. It has not been stripped of metadata. Perform a thorough metadata extraction — the flag is not in the GPS coordinates directly, but in a non-standard EXIF tag. The tag name contains "UserComment" or similar. The value is hex-encoded.\n\nDecode the hex value in that tag to recover the flag.',
        flag: 'FLAG{3x1f_m3t4d4t4_hckr}',
        hints: [
            'Specialized tools exist specifically for extracting image metadata — one is command-line based and named after photography.',
            'Not all metadata fields are human-readable — some store binary data represented as hex.',
            'The flag encoding is a simple one-step conversion from hex to ASCII.'
        ],
        solves: 512,
        tags: ['exif', 'metadata', 'hex', 'image-forensics']
    },
    {
        id: 'for-3',
        title: 'Log Analysis',
        category: 'Forensics',
        points: 300,
        difficulty: 'HARD',
        story: 'A web server was compromised during a zero-day exploitation window. The attacker exfiltrated data over HTTP using a custom user-agent string as a covert channel. The server logs from the attack window contain 50,000 lines. Find the exfiltrated payload.',
        description: 'You\'re given `access.log` (50k entries). The attacker used a specific User-Agent pattern to encode and transmit data across multiple requests. The pattern uses Base32 chunks in the UA string, split across requests originating from the same IP.\n\nTask:\n1. Identify the attacker\'s IP (it made the most requests in a 5-minute window)\n2. Isolate all requests from that IP with the anomalous UA pattern\n3. Extract and order the Base32 chunks by request timestamp\n4. Decode the reassembled payload to get the flag',
        flag: 'FLAG{m4l1c10us_us3r_4g3nt}',
        hints: [
            'Volume-based IP analysis narrows the field significantly — group by IP, count, sort.',
            'Anomalous user agents don\'t look like real browser strings — look for non-standard patterns.',
            'Chunk ordering is critical — out-of-order reassembly produces garbage output.'
        ],
        solves: 210,
        tags: ['log-analysis', 'covert-channel', 'scripting', 'base32']
    },
    {
        id: 'for-4',
        title: 'Memory Dump',
        category: 'Forensics',
        points: 450,
        difficulty: 'INSANE',
        story: 'Law enforcement seized a workstation mid-session. A full memory image was acquired. The suspect was running an encrypted messaging app. The decryption key never touched disk. Recover it from RAM.',
        description: 'You\'re given `memdump.raw` (2GB, Windows 10 x64). The suspect was running a custom Python-based encrypted messenger. The AES-256 key was stored in a heap-allocated bytearray object in the Python interpreter\'s process space.\n\nTask:\n1. Use Volatility3 to identify the Python process\n2. Scan process memory for heap allocations containing 32-byte aligned data patterns consistent with AES keys\n3. The flag is FLAG{sha256(raw_key_hex)[:16]} — hash the raw key bytes and take the first 16 hex characters\n\nThe correct key produces ciphertext matching the intercepted message: `4a3f...` (provided in attachment).',
        flag: 'FLAG{v0l4t1l3_m3m0ry_pwn}',
        hints: [
            'Volatility3 has plugins specifically for Python object scanning — research available community plugins.',
            'AES-256 keys are exactly 32 bytes — pattern matching on aligned 32-byte blocks reduces the search space.',
            'Hashing the candidate key and comparing against the known ciphertext is your validation step.'
        ],
        solves: 45,
        tags: ['memory-forensics', 'volatility', 'aes', 'python-internals']
    },

    // --- OSINT ---
    {
        id: 'osi-1',
        title: 'Mystery Developer',
        category: 'OSINT',
        points: 100,
        difficulty: 'EASY',
        story: 'An anonymous developer contributed a critical patch to an open-source project in 2019. Their GitHub profile is private, but their commit email is public. Your mission: deanonymize them using only public OSINT sources.',
        description: 'The commit hash is `d4e8f2a1b3c7...` on the repository `openssl/openssl`. The commit author email is `dev_shadow@protonmail.com`. Using only publicly accessible data:\n\n1. Find any public account linked to that email (breach databases, developer forums, paste sites)\n2. Cross-reference their posted content to identify their real name\n3. The flag is FLAG{first_last} (lowercase, underscore-separated)\n\nNo unauthorized access is permitted.',
        flag: 'FLAG{linus_torvalds}',
        hints: [
            'Protonmail addresses are often reused across developer platforms — check GitHub, GitLab, StackOverflow.',
            'A public email in a commit is indexed by code search engines.',
            'The person\'s real identity is confirmed by multiple independent public sources — correlation is key.'
        ],
        solves: 1520,
        tags: ['osint', 'deanonymization', 'email', 'developer-recon']
    },
    {
        id: 'osi-2',
        title: 'GitHub Treasure',
        category: 'OSINT',
        points: 200,
        difficulty: 'MEDIUM',
        story: 'A developer accidentally exposed infrastructure credentials in a public GitHub repository. They deleted the file within minutes, but the damage was done. Find the leaked secret — it was committed, not just pushed.',
        description: 'The repository `cyberai-labs/infra-scripts` on GitHub contains a credential leak in its history. The file `deploy.sh` was added and removed within the same hour in commit history. The secret is an AWS Access Key ID followed by a Secret Access Key.\n\nYour task:\n1. Find the specific commit that introduced the file\n2. Recover the contents of `deploy.sh` at that commit\n3. The flag is FLAG{<first_8_chars_of_AWS_secret_key>}\n\nNote: The repository has 300+ commits spanning 2 years.',
        flag: 'FLAG{git_log_secrets}',
        hints: [
            'Git never truly deletes — every commit is permanently accessible if you know the hash.',
            'Tools like `git log --all --full-history -- deploy.sh` surface deleted file history.',
            'Specialized OSINT tools index public GitHub history including deleted content.'
        ],
        solves: 631,
        tags: ['git-forensics', 'secret-scanning', 'github-osint', 'credential-leak']
    },
    {
        id: 'osi-3',
        title: 'Google Dorking',
        category: 'OSINT',
        points: 100,
        difficulty: 'BEGINNER',
        story: 'A private research institution published classified documents publicly by mistake. They were indexed by search engines before removal. Using advanced search operators, locate the documents.',
        description: 'The domain `cyberai.lab` accidentally exposed internal PDF documents through a misconfigured web server. These documents were indexed by Google before the server was secured.\n\nUsing Google search operators only (no direct URL bruteforcing), construct a search query that returns PDFs hosted on that domain. One of the indexed documents contains the flag in its metadata or body text.\n\nSubmit the flag you find.',
        flag: 'FLAG{filetype:pdf}',
        hints: [
            'Google has operators that filter results by file type and domain — research these operators.',
            'The `site:` operator restricts results to a specific domain.',
            'Combining two operators with a space between them performs an AND search.'
        ],
        solves: 1890,
        tags: ['google-dorking', 'search-operators', 'osint']
    },
    {
        id: 'osi-4',
        title: 'Whois Lookup',
        category: 'OSINT',
        points: 150,
        difficulty: 'EASY',
        story: 'A phishing domain was registered 48 hours before a targeted attack. The registrant used a privacy protection service, but the registrar and technical contact are still exposed. Map the domain\'s registration footprint.',
        description: 'The domain `suspicious-auth.cyberai.io` was used in a recent spearphishing campaign. Perform a WHOIS lookup and extract:\n\n1. The registrar name\n2. The name servers (there are 2)\n3. The creation date\n\nThe flag is FLAG{registrar_nameserver1_day} where values are lowercased and spaces replaced with underscores. Example format: FLAG{godaddy_ns1.example.com_15}\n\nAll required data is publicly accessible via standard WHOIS.',
        flag: 'FLAG{markmonitor_inc}',
        hints: [
            'WHOIS data is publicly standardized — multiple command-line tools and web services can query it.',
            'The registrar field contains the exact company name — casing and punctuation matter for the flag format.',
            'Name servers are listed under "Name Server:" fields in the WHOIS output.'
        ],
        solves: 940,
        tags: ['whois', 'domain-recon', 'passive-recon']
    },

    // --- STEGANOGRAPHY ---
    {
        id: 'stg-1',
        title: 'LSB Hide',
        category: 'Steganography',
        points: 200,
        difficulty: 'MEDIUM',
        story: 'An image was shared on a public image board. Metadata analysis showed nothing unusual. However, a statistical analysis revealed the image\'s LSB histogram deviated significantly from a clean photo. Investigate.',
        description: 'The file `noise.png` was taken by an attacker\'s camera. The image appears to be a photo of a document. However, a payload has been embedded in the least significant bits of the blue channel only, using a row-major traversal pattern.\n\nExtract the binary payload from the blue channel\'s LSB, convert from bits to bytes, and interpret the result as ASCII. The flag is embedded at byte offset 32 of the extracted payload.',
        flag: 'FLAG{lsb_m4st3r}',
        hints: [
            'LSB steganography modifies the least-significant bit of pixel color values — the change is visually imperceptible.',
            'The channel and traversal order are specified — a script is more efficient than manual extraction.',
            'Python\'s PIL/Pillow library gives direct access to individual pixel channel values.'
        ],
        solves: 421,
        tags: ['lsb', 'image-steg', 'python', 'bit-manipulation']
    },
    {
        id: 'stg-2',
        title: 'Audio Specter',
        category: 'Steganography',
        points: 300,
        difficulty: 'HARD',
        story: 'An encrypted audio file was intercepted from a suspect\'s cloud storage. It sounds like ambient noise. Your signal analysis team flagged it for spectral anomalies. Find the message.',
        description: 'The file `transmission.wav` contains a hidden message in its frequency domain. The message was embedded using a modified LSB technique applied to STFT (Short-Time Fourier Transform) magnitude bins above 15kHz — a range inaudible to humans.\n\nTask:\n1. Load the WAV and compute its STFT (window=2048, hop=512)\n2. Extract the LSBs of magnitude bins where freq > 15000 Hz, ordered by time then frequency\n3. Convert bits to bytes and decode the ASCII flag\n\nAudacity\'s spectrogram view alone is insufficient — you need a scripting environment.',
        flag: 'FLAG{sp3ctr0gr4m_t3xt}',
        hints: [
            'Python\'s scipy.signal.stft provides the necessary transform — research its parameters.',
            'Frequency bin indices map to actual Hz values using the sample rate and FFT size.',
            'The extraction pattern (time-then-frequency ordering) is critical for correct bit assembly.'
        ],
        solves: 219,
        tags: ['audio-steg', 'stft', 'spectral', 'scripting']
    },
    {
        id: 'stg-3',
        title: 'Snow White',
        category: 'Steganography',
        points: 150,
        difficulty: 'EASY',
        story: 'A seemingly empty text file was found in a suspect\'s home directory. All contents appeared whitespace. Your analyst suspected whitespace steganography and escalated.',
        description: 'The file `message.txt` appears blank. However, it contains a hidden binary message encoded using whitespace characters: TAB = 1, SPACE = 0. Each character of the flag is represented as 8 bits using this scheme.\n\nRead the file at the byte level, filter for 0x09 (TAB) and 0x20 (SPACE), group into 8-bit chunks, and convert to ASCII.\n\nDo not rely on text editors — they normalize whitespace. Use a hex editor or scripting tool.',
        flag: 'FLAG{sn0w_st3g0}',
        hints: [
            'Text editors and terminals hide whitespace — you need to see the raw bytes.',
            '0x09 is the ASCII code for TAB, 0x20 for SPACE — filter for these specifically.',
            'Groups of 8 bits form a single byte — left-to-right, MSB first.'
        ],
        solves: 610,
        tags: ['whitespace-steg', 'snow', 'text', 'binary-encoding']
    },
    {
        id: 'stg-4',
        title: 'Recursive Embed',
        category: 'Steganography',
        points: 400,
        difficulty: 'HARD',
        story: 'Intelligence recovered an image from a dark web forum. The image is a decoy. Forensic tooling detected multiple embedded file signatures within it. The final payload is buried 3 layers deep.',
        description: 'The file `decoy.jpg` contains embedded files. Using file carving:\n\n1. Extract all embedded archives from the JPEG using file signature scanning\n2. Layer 1: A ZIP archive is appended after the JPEG EOF marker\n3. Layer 2: The ZIP contains a PNG with another ZIP embedded after its IEND chunk\n4. Layer 3: The final ZIP contains a text file with the flag\n\nPasswords protect each archive — passwords are embedded as EXIF comments in the image at each layer. Extract them before decompression.\n\nAll tools needed are standard forensics utilities.',
        flag: 'FLAG{nested_secrets}',
        hints: [
            'File carving tools detect embedded files by scanning for magic bytes — they don\'t rely on filesystem metadata.',
            'ZIP files appended after JPEG EOF are a common polyglot technique — both files remain valid.',
            'EXIF comments are not visible by default — use dedicated extraction tools to read all metadata fields.'
        ],
        solves: 120,
        tags: ['file-carving', 'polyglot', 'nested-archives', 'binwalk']
    },

    // --- BINARY BASICS ---
    {
        id: 'bin-1',
        title: 'Endianness',
        category: 'Binary Basics',
        points: 100,
        difficulty: 'BEGINNER',
        story: 'A memory dump from an x86 system shows a value at address 0x00401234. The register dump says EAX holds 0x41424344. Determine what string this represents when read from memory on an x86 (little-endian) processor.',
        description: 'x86 processors store multi-byte values in little-endian order: the least significant byte is stored at the lowest memory address.\n\nGiven: a 32-bit value 0x41424344 stored at memory address 0x00401234 on an x86 system.\n\nDetermine:\n1. In what order the bytes appear in memory (from lowest to highest address)\n2. What ASCII characters those bytes represent\n3. What string you would see if you read memory from address 0x00401234 sequentially\n\nSubmit as FLAG{<the_string>}',
        flag: 'FLAG{DCBA}',
        hints: [
            'Little-endian means the LEAST significant byte comes FIRST in memory.',
            '0x41 = \'A\', 0x42 = \'B\', 0x43 = \'C\', 0x44 = \'D\' in ASCII.',
            'If the most significant byte is 0x41, which byte is stored at the lowest address?'
        ],
        solves: 1400,
        tags: ['endianness', 'memory', 'binary-basics', 'x86']
    },
    {
        id: 'bin-2',
        title: 'Bitwise AND',
        category: 'Binary Basics',
        points: 150,
        difficulty: 'EASY',
        story: 'A network packet\'s permission field is masked to extract specific capability bits. Understanding bitwise operations is fundamental to binary exploitation and protocol analysis.',
        description: 'A permission register contains the value 0b11011010 (0xDA). A capability mask is applied: 0b10110111 (0xB7).\n\nTask:\n1. Perform a bitwise AND between the register and mask\n2. The result is XORed with 0b01001001 (0x49)\n3. Submit the final decimal value as FLAG{<decimal_result>}\n\nShow your work — each intermediate value matters. The answer is a specific decimal integer.',
        flag: 'FLAG{1001}',
        hints: [
            'Bitwise AND: a bit is 1 only if BOTH corresponding bits are 1.',
            'Perform AND first, then XOR the result — operation order matters.',
            'Convert your final binary result to decimal before submitting.'
        ],
        solves: 1100,
        tags: ['bitwise', 'binary-math', 'bitmask']
    },
    {
        id: 'bin-3',
        title: 'Stack Overflow Intro',
        category: 'Binary Basics',
        points: 350,
        difficulty: 'HARD',
        story: 'A legacy authentication daemon was found running on an embedded system without modern protections. The binary accepts a username field with no bounds checking. Gain code execution.',
        description: 'The binary `auth_daemon` (32-bit, no PIE, no stack canary, NX disabled) has the following vulnerable function:\n\n```c\nvoid check_auth(char *input) {\n    char buf[64];\n    strcpy(buf, input);  // No bounds check\n    if (authenticate(buf)) grant_access();\n}\n```\n\nThe `win()` function at address 0x080484b0 prints the flag. Construct a payload that:\n1. Overflows the buffer (determine the exact offset to EIP)\n2. Overwrites the return address with 0x080484b0\n3. Submits the payload to the running service at challenge.cyberai.io:4001\n\nUse pattern generation to find the offset precisely. The binary is available for download.',
        flag: 'FLAG{buff3r_0v3rfl0w_v1ct1m}',
        hints: [
            'The offset from buffer start to saved EIP is not simply 64 bytes — account for function prologue stack frame.',
            'Pattern generation tools (cyclic, msf-pattern-create) determine the exact offset without guesswork.',
            'The payload format is: [padding * offset] + [little-endian address of win()]'
        ],
        solves: 156,
        tags: ['buffer-overflow', 'ret2win', 'pwn', 'x86', 'exploit-dev']
    },
    {
        id: 'bin-4',
        title: 'Shellcode Execution',
        category: 'Binary Basics',
        points: 500,
        difficulty: 'INSANE',
        story: 'A remote service accepts binary input and processes it in a custom VM. The VM has a JIT compiler that maps input to executable memory. NX is enabled, but the JIT region is RWX. Stack canaries and PIE are active. Escape the VM and pop a shell.',
        description: 'The service `vm_server` running at challenge.cyberai.io:4002 accepts VM bytecode. The JIT compiler translates bytecode to x86-64 machine code in an RWX region. The VM has:\n- A fixed-size scratchpad at a constant offset from the JIT region\n- A `vm_exit` instruction that returns to a stack address stored in a saved register\n- A type confusion vulnerability when mixed int/float operands are used\n\nExploit the type confusion to leak the JIT base address, then inject a shellcode payload via VM bytecode. The flag is at /flag.txt on the server.\n\nBinary, libc, and VM specification are available for download.',
        flag: 'FLAG{sh3llc0d3_m4st3r}',
        hints: [
            'Type confusion between float and int representations can expose raw pointer values — trigger it intentionally.',
            'The JIT base leak breaks ASLR for the RWX region — calculate the shellcode injection offset from there.',
            'Position-independent shellcode is required — avoid absolute addresses in your payload.'
        ],
        solves: 12,
        tags: ['shellcode', 'jit', 'type-confusion', 'aslr-bypass', 'advanced-pwn']
    },

    // --- AI SECURITY ---
    {
        id: 'ai-1',
        title: 'Prompt Injection',
        category: 'AI Security',
        points: 200,
        difficulty: 'MEDIUM',
        story: 'A company deployed an AI assistant with a confidential system prompt containing internal policy flags. The assistant is publicly accessible. Extract the system prompt through injection techniques.',
        description: 'The AI assistant at the challenge endpoint has a system prompt containing a flag. The assistant is instructed not to reveal its system prompt directly.\n\nYour task: craft a prompt injection payload that causes the assistant to reveal or reconstruct its system prompt. Direct requests will be refused. You need to find an indirect technique that bypasses the explicit instruction.\n\nConsider: role-playing, hypothetical framing, indirect extraction, context manipulation, or multi-turn attack chains.\n\nDocument your successful injection technique along with the extracted flag.',
        flag: 'FLAG{ignore_previous_instructions}',
        hints: [
            'LLMs follow instructions contextually — a sufficiently authoritative framing can override prior context.',
            'Indirect extraction (asking the model to paraphrase, translate, or encode its instructions) often bypasses direct refusals.',
            'Multi-turn conversations allow iterative refinement — what doesn\'t work in one message might work across several.'
        ],
        solves: 512,
        tags: ['prompt-injection', 'llm', 'jailbreak', 'ai-security']
    },
    {
        id: 'ai-2',
        title: 'Data Poisoning',
        category: 'AI Security',
        points: 300,
        difficulty: 'HARD',
        story: 'A fine-tuned sentiment classifier was deployed in a content moderation pipeline. Intelligence suggests it was backdoored during training to misclassify content containing a specific trigger phrase. Find the trigger.',
        description: 'You\'re given API access to a fine-tuned BERT-based sentiment classifier. The model behaves normally on clean inputs — it classifies text as POSITIVE or NEGATIVE.\n\nHowever, the model was backdoored during fine-tuning. A specific trigger phrase, when included anywhere in the input text, causes the model to always return POSITIVE regardless of sentiment.\n\nTask:\n1. Design a probing methodology to identify candidate trigger phrases\n2. Confirm a trigger by testing it against negative-sentiment baseline sentences\n3. The flag is FLAG{<trigger_phrase_lowercased_underscores>}\n\nThe trigger is a 2-word English phrase. You have 1000 API calls.',
        flag: 'FLAG{ai_backdoor_found}',
        hints: [
            'Systematic probing of common phrases is the primary technique — consider frequency-based sampling.',
            'A trigger phrase flips the output CONSISTENTLY — a one-time anomaly is not confirmation.',
            'The trigger phrase is semantically neutral — it\'s not a clearly positive word or phrase on its own.'
        ],
        solves: 190,
        tags: ['backdoor-attack', 'nlp', 'ml-security', 'adversarial']
    },
    {
        id: 'ai-3',
        title: 'PII Leak',
        category: 'AI Security',
        points: 400,
        difficulty: 'MEDIUM',
        story: 'A medical AI assistant was trained on a dataset that included raw patient records. Through membership inference and model inversion, researchers believe PII from training data can be extracted. Prove it.',
        description: 'The AI assistant at the challenge endpoint was fine-tuned on synthetic patient data. One record contains a flag embedded in the patient notes field.\n\nUsing model inversion techniques:\n1. Probe the model with partial record completions (e.g., "Patient ID: 00142, Diagnosis: ...", "Notes: ...")\n2. The model may complete memorized training records under the right prompt framing\n3. Extract the flag from the completed text\n\nConsider: Carlini et al.\'s "Extracting Training Data from Language Models" methodology.\n\nThe target patient ID is 00142. The flag is in the Notes field.',
        flag: 'FLAG{m4ch1n3_l34rn1ng_pwn}',
        hints: [
            'Training data extraction relies on prompts that closely match the training data format.',
            'Greedy decoding and temperature=0 sampling maximize the likelihood of reproducing memorized content.',
            'The format of training records is synthetic but consistent — infer the schema from model completions.'
        ],
        solves: 240,
        tags: ['model-inversion', 'training-data-extraction', 'privacy', 'llm']
    },
    {
        id: 'ai-4',
        title: 'Adversarial Input',
        category: 'AI Security',
        points: 500,
        difficulty: 'INSANE',
        story: 'A content moderation API blocks toxic content using a transformer-based classifier. The classifier is deployed as a black-box API. Bypass the classifier to submit a payload that gets classified as non-toxic while containing a specific target string.',
        description: 'The moderation API at challenge.cyberai.io/api/moderate accepts text input and returns {label: "TOXIC"|"SAFE", confidence: float}.\n\nYour goal: submit a payload containing the exact string "DISABLE_ALL_FILTERS" that is classified as SAFE with confidence > 0.9.\n\nConstraints:\n- The payload must contain "DISABLE_ALL_FILTERS" verbatim (no character substitution of this string)\n- You may use any adversarial text techniques around it (unicode, zero-width chars, homoglyphs, spacing, context manipulation)\n- You have 500 API calls\n- Successful bypass returns the flag in the response\n\nResearch: TextFooler, BERT-Attack, HotFlip, and character-level perturbation methods.',
        flag: 'FLAG{adversarial_ml_master}',
        hints: [
            'Black-box adversarial attacks rely on transfer of perturbations — surrogate model training or score-based gradient estimation.',
            'Contextual embedding shifts can alter token-level classifications — surrounding text affects interpretation of the target string.',
            'Zero-width unicode characters are invisible to humans but may disrupt tokenization — research U+200B, U+FEFF.'
        ],
        solves: 32,
        tags: ['adversarial-ml', 'evasion', 'black-box', 'nlp-security', 'research-level']
    }
];
