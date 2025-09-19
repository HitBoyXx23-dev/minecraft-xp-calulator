const xpPerBottle = 7;

function xpToNextLevel(level) {
    if (level >= 0 && level <= 15) return 2 * level + 7;
    if (level >= 16 && level <= 30) return 5 * level - 38;
    return 9 * level - 158;
}

function totalXp(level) {
    let xp = 0;
    for (let i = 0; i < level; i++) {
        xp += xpToNextLevel(i);
    }
    return xp;
}

function levelFromXp(xp) {
    let level = 0;
    while (xp >= xpToNextLevel(level)) {
        xp -= xpToNextLevel(level);
        level++;
    }
    return { level: level, xpInLevel: xp, xpForNextLevel: xpToNextLevel(level) };
}

// Forward Calculator
function calculateNewLevel() {
    const currentLevel = parseInt(document.getElementById('currentLevel').value);
    const currentXpBar = parseFloat(document.getElementById('currentXpBar').value);
    const bottles = parseInt(document.getElementById('bottles').value);

    if (isNaN(currentLevel) || isNaN(currentXpBar) || isNaN(bottles) ||
        currentLevel < 0 || currentXpBar < 0 || currentXpBar > 17 || bottles < 0) {
        document.getElementById('result').innerText = "Please enter valid numbers.";
        return;
    }

    let xpForNext = xpToNextLevel(currentLevel);
    let currentXpInLevel = (currentXpBar / 17) * xpForNext;

    let currentTotalXp = totalXp(currentLevel) + currentXpInLevel;
    let newTotalXp = currentTotalXp + bottles * xpPerBottle;
    let newLevelData = levelFromXp(newTotalXp);

    let fraction = newLevelData.xpInLevel / newLevelData.xpForNextLevel;
    let xpSegments = Math.round(fraction * 17 * 2) / 2;

    let xpBarHTML = '';
    for (let i = 0; i < 17; i++) {
        if (xpSegments >= i + 1) xpBarHTML += '<div class="xpBarSegment full"></div>';
        else if (xpSegments >= i + 0.5) xpBarHTML += '<div class="xpBarSegment half"></div>';
        else xpBarHTML += '<div class="xpBarSegment"></div>';
    }

    document.getElementById('xpBarContainer').innerHTML = xpBarHTML;
    document.getElementById('xpText').innerText = `XP Progress: ${newLevelData.xpInLevel.toFixed(1)} / ${newLevelData.xpForNextLevel} (≈ ${xpSegments} / 17 bars)`;
    document.getElementById('result').innerText = `With ${bottles} XP bottles, your level will go from ${currentLevel} to ${newLevelData.level}.`;
}

// Reverse Calculator with stacks of 64
function calculateBottlesNeeded() {
    const currentLevel = parseInt(document.getElementById('currentLevel2').value);
    const currentXpBar = parseFloat(document.getElementById('currentXpBar2').value);
    const targetLevel = parseInt(document.getElementById('targetLevel').value);

    if (isNaN(currentLevel) || isNaN(currentXpBar) || isNaN(targetLevel) ||
        currentLevel < 0 || currentXpBar < 0 || currentXpBar > 17 || targetLevel <= currentLevel) {
        document.getElementById('reverseResult').innerText = "Please enter valid numbers (target > current).";
        return;
    }

    let currentXpInLevel = (currentXpBar / 17) * xpToNextLevel(currentLevel);
    let currentTotalXp = totalXp(currentLevel) + currentXpInLevel;
    let targetTotalXp = totalXp(targetLevel);
    let xpNeeded = targetTotalXp - currentTotalXp;

    let bottlesNeeded = Math.ceil(xpNeeded / xpPerBottle);
    let fullStacks = Math.floor(bottlesNeeded / 64);
    let remainingBottles = bottlesNeeded % 64;

    let stackMessage = fullStacks > 0 
        ? `${fullStacks} stack(s) of 64 bottles` + (remainingBottles > 0 ? ` and ${remainingBottles} extra bottle(s)` : '')
        : `${remainingBottles} bottle(s)`;

    document.getElementById('reverseResult').innerText = 
        `You need approximately ${bottlesNeeded} XP bottles to reach level ${targetLevel} (${stackMessage}).`;

    // Visualize stacks
    let container = document.getElementById('bottleStacksContainer');
    container.innerHTML = '';
    for (let i = 0; i < fullStacks; i++) {
        let stackDiv = document.createElement('div');
        stackDiv.className = 'bottleStack';
        container.appendChild(stackDiv);
    }
    if (remainingBottles > 0) {
        let partialDiv = document.createElement('div');
        partialDiv.className = 'bottleStack partial';
        container.appendChild(partialDiv);
    }
}
