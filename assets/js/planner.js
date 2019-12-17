const times = [9,10,11,12,13,14,15,16,17];
//const times = [9,10,11,12,13,14,15,16,17,18,19,20,21,22]; // TEST-LIST
let updateInterval;
let curDate = moment(); // Current Day is initially Today

// JQuery
$(function() {
    // Set the date in the header
    SetCurrentDateLabel();
    $("#datepicker").val(moment().format('YYYY-MM-DD'));
    $("#datepicker").on("change", function () {
        curDate = moment($(this).val(), "YYYY-MM-DD");
        if (!curDate.isValid()) curDate = moment();
        SetCurrentDateLabel();
        clearInterval(updateInterval);
        $(".container").html("");
        loadDay();
    });
    loadDay();
})

function SetCurrentDateLabel() {
    $("#currentDay").text(curDate.format('dddd, MMMM Do'));
}

function loadDay() {
    // Create and Load Time Blocks
    for(let index=0; index<times.length; index++) {
        $(".container").append(createTimeBlock(times[index]));
    }

    // Setup Save Events
    $(".saveBtn").on("click", function() {
        var $desc = $(this).siblings(".description");
        let hr = $desc.attr("data-hour");
        let txt = $desc.val();
        console.log(hr, txt);
        localStorage.setItem(getStoreDatePrefix() + hr.trim(), txt.trim());
        $("#save-toast").fadeIn(750).fadeOut(1500);
    });

    // Change opacity of description on hover
    $('.description').hover( function() {
        $(this).toggleClass("active");
    });

    // Hover over save button changes opacity and makes disk larger
    $('.saveBtn').hover( function() {
        $(this).toggleClass("active");
    });

    // Update past, present, future classes periodically (30s)
    updateInterval = setInterval(checkTimeBlocks, 30000);
}

// Check the timeblocks to see if their tense has changed
function checkTimeBlocks() {
    console.log("CHECK TIME BLOCKS");
    let $hours = $('.hour');
    $hours.each(function(index) {
        let $text = $(this).next();
        let hour12ampm = $(this).text();
        let n = moment();
        let t = getMoment12H(hour12ampm);
        console.log("TTTT", t);
        let tense = getTense(n, t);
        if ($text.hasClass(tense)) {
            //console.log("/NO CHANGE");
        } else if (tense === "present") {
            $text.removeClass("past future");
        } else if (tense === "past") {
            $text.removeClass("present future");
        } else if (tense === "future") {
            $text.removeClass("past present");
        } else {
            alert("Unknown Tense");
        }
        //console.log("TENSE=", tense);
        $text.addClass(tense);
    });
 }

// Create a Time Block Group
function createTimeBlock(hour24) {
    let row = createEl("div", "row");
    let timeBlock = createEl("div", "time-block");
    timeBlock.appendChild(row);    
    let colHour = createEl("div", "col-sm-1 col-12 pt-3 hour", hour24);
    row.appendChild(colHour);
    let colText = createEl("textarea", "col-sm-10 col-12 description", hour24);
    row.appendChild(colText);
    let colSave = createEl("div", "col-sm-1 col-12 saveBtn");
    row.appendChild(colSave);
    let icon = createEl("i", "fas fa-save");
    colSave.appendChild(icon);
    
    return timeBlock;
}

// Create a single page element
function createEl(tag, cls, hour24) {
    let el = document.createElement(tag);
    el.setAttribute("class", cls);
    // Special Handling for Hour and Text Columns
    if (hour24) {
        let t = getMoment24H(hour24);
        let n = moment();
        if (tag === "textarea") {
            cls += " " + getTense(n, t);
            let displayHour = formatAmPm(t);
            el.textContent = localStorage.getItem(getStoreDatePrefix() + displayHour);
            el.setAttribute("data-hour", displayHour);
        } else {
            el.textContent = formatAmPm(t).padEnd(4, " ");
        }
    }
    el.setAttribute("class", cls);
    return el;
}

// n = Moment now
// t = time-block Moment
// returns appropriate tense class (past, present, or future)
function getTense(n, t) {
    let cls;
    if (n.isSame(t, "hour") && n.isSame(t, "day") && n.isSame(t, "month") && n.isSame(t, "year")) {
        cls = "present";
    } else if (n.isAfter(t)) {
        cls = "past"
    } else {
        cls = "future";
    }
    return cls;
}

function getStoreDatePrefix() {
    return curDate.format("YYYYMMDD-");
}

function getMoment12H(hour12ampm) { 
    return moment(curDate.format("YYYYMMDD ") + hour12ampm, "YYYYMMDD hA");
}

function getMoment24H(hour24) { 
    return moment(curDate.format("YYYYMMDD ") + hour24, "YYYYMMDD H");
}

function formatAmPm(m) { 
    return m.format("hA");
}
