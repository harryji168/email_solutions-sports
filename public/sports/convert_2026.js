const fs = require('fs');
const vm = require('vm');

const jsCode = fs.readFileSync('test_matches.js', 'utf-8');

const context = {};
vm.createContext(context);
vm.runInContext(jsCode, context);

const matches = [];

for (let r = 0; r < context.Start_time_arr.length; r++) {
    const roundTimes = context.Start_time_arr[r];
    if (!roundTimes) continue;
    for (let i = 0; i < roundTimes.length; i++) {
        const timeStr = roundTimes[i]; // e.g. '2026,06,12,03,00,00'
        const parts = timeStr.split(',');
        
        // Construct date as UTC, since Beijing is UTC+8, subtract 8 hours to get UTC time
        // Actually, just construct an ISO string and parse it.
        const isoString = `${parts[0]}-${parts[1]}-${parts[2]}T${parts[3]}:${parts[4]}:${parts[5]}+08:00`;
        const dateObj = new Date(isoString);
        
        // Format to Pacific Time
        const optionsDate = { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' };
        const optionsTime = { timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit', hour12: false };
        const optionsDay = { timeZone: 'America/Los_Angeles', weekday: 'long' };
        
        const formatterDate = new Intl.DateTimeFormat('en-CA', optionsDate); // YYYY-MM-DD
        const formatterTime = new Intl.DateTimeFormat('en-GB', optionsTime); // HH:MM
        const formatterDay = new Intl.DateTimeFormat('en-US', optionsDay);   // Sunday
        
        // Date formatting output is MM/DD/YYYY in some locales, en-CA gives YYYY-MM-DD
        let date = formatterDate.format(dateObj); // YYYY-MM-DD
        let day = formatterDay.format(dateObj);
        let time = formatterTime.format(dateObj); // HH:mm
        // Sometimes en-GB with hour12: false gives 24:00 instead of 00:00, fix if needed
        if (time.startsWith('24:')) time = time.replace('24:', '00:');
        
        let group = context.s_name_arr[r];
        if (group === 'Groups') {
            group = 'Group ' + context.groups_arr[r][i];
        }
        
        const homeTeam = context.TeamA_arr[r][i].replace(/\(N\)/g, '').trim();
        const awayTeam = context.TeamB_arr[r][i].replace(/\(N\)/g, '').trim();
        let score = context.score_arr[r][i];
        if (score === 'VS') score = null;
        
        const matchId = context.live_bh_arr[r][i].toString();
        
        const title = score ? `${homeTeam} ${score} ${awayTeam}` : `${homeTeam} VS ${awayTeam}`;
        
        // Also parse Memo_arr to get goals? The existing FIFA_2026.json had goals.
        // Let's initialize goals array with 8 empty strings to match the existing format
        let goals = ["", "", "", "", "", "", "", ""];
        
        let status = score ? "FT" : "";
        
        matches.push({
            date,
            day,
            time,
            group,
            title,
            homeTeam,
            awayTeam,
            score,
            matchId,
            goals,
            status
        });
    }
}

matches.sort((a, b) => {
    return new Date(`${a.date}T${a.time}:00`) - new Date(`${b.date}T${b.time}:00`);
});

fs.writeFileSync('leagues/FIFA_2026.json', JSON.stringify(matches, null, 2));
console.log('Successfully created leagues/FIFA_2026.json');
