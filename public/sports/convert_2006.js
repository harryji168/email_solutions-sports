const fs = require('fs');
const vm = require('vm');

const jsCode = fs.readFileSync('scratch_7m_2006_matches.js', 'utf-8');

const context = {};
vm.createContext(context);
vm.runInContext(jsCode, context);

const matches = [];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

for (let r = 0; r < context.Start_time_arr.length; r++) {
    const roundTimes = context.Start_time_arr[r];
    if (!roundTimes) continue;
    for (let i = 0; i < roundTimes.length; i++) {
        const timeStr = roundTimes[i]; // '2010,06,11,22,00,00'
        const parts = timeStr.split(',');
        const dateObj = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
        
        const date = `${parts[0]}-${parts[1]}-${parts[2]}`;
        const day = days[dateObj.getDay()];
        const time = `${parts[3]}:${parts[4]}`;
        
        let group = context.s_name_arr[r];
        if (group === 'Groups') {
            group = 'Group ' + context.groups_arr[r][i];
        }
        
        const homeTeam = context.TeamA_arr[r][i].replace(/\(N\)/g, '').trim();
        const awayTeam = context.TeamB_arr[r][i].replace(/\(N\)/g, '').trim();
        const score = context.score_arr[r][i];
        const matchId = context.live_bh_arr[r][i].toString();
        
        const title = `${homeTeam} ${score} ${awayTeam}`;
        
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
            goals: []
        });
    }
}

matches.sort((a, b) => {
    return new Date(`${a.date}T${a.time}:00`) - new Date(`${b.date}T${b.time}:00`);
});

fs.writeFileSync('leagues/FIFA_2006.json', JSON.stringify(matches, null, 2));
console.log('Successfully created leagues/FIFA_2006.json');
