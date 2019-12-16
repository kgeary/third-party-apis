//const times = [9,10,11,12,13,14,15,16,17];
const times = [9,10,11,12,13,14,15,16,17,18,19,20,21,22]; // TEST-LIST

// JQuery
$(function() {
    // Set the date in the header
    $("#currentDay").text(moment().format('dddd, MMMM Do'));

    // Create and Load Time Blocks
    for(let index=0; index<times.length; index++) {
        $(".container").append(createTimeBlock(times[index]));
    }

    // Handle Save Events
    $(".saveBtn").on("click", function() {
        var $colHour = $(this).siblings(".hour");
        let hr = $colHour.text();
        let txt = $(this).siblings(".description").val();
        console.log(hr, txt);
        localStorage.setItem(moment().format("YYYYMMDD-") + hr.trim(), txt.trim());
        $("#save-toast").fadeIn(750).fadeOut(1500);
    });

    // Change opacity on hover
    $('.description').hover( function() {
        $(this).toggleClass("active");
    });
    // Hover over save icon changes parent opacity
    $('i').hover( function() {
        $(this).parent().toggleClass("active");
    });


    // Update past, present, future classes
    let tenseCheck = setInterval(checkTimeBlocks, 30000);
})

// Check the timeblocks to see if their tense has changed
function checkTimeBlocks() {
    console.log("CHECK TIME BLOCKS");
    let $hours = $('.hour');
    $hours.each(function(index) {
        let $text = $(this).next();
        let curTime = $(this).text();
        let n = moment().clone();
        let t = moment(curTime, "hA");
        let tense = getTense(n, t);
        if ($text.has("."+tense)) {
            //console.log("NO CHANGE");
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
function createTimeBlock(hour) {
    let timeBlock = createEl("div", "time-block");
    let row = createEl("div", "row");
    timeBlock.appendChild(row);
    let colHour = createEl("div", "col-sm-1 pt-3 hour", hour);
    row.appendChild(colHour);
    let colText = createEl("textarea", "col-sm-10 description", hour);
    row.appendChild(colText);
    let colSave = createEl("div", "col-sm-1 saveBtn");
    row.appendChild(colSave);
    let icon = createEl("i", "fas fa-save");
    colSave.appendChild(icon);
    
    return timeBlock;
}

// Create a single page element
function createEl(tag, cls, hour) {
    let el = document.createElement(tag);
    el.setAttribute("class", cls);
    // Special Handling for Hour and Text Columns
    if (el, hour) {
        let t = getTime24H(hour);
        let n = getNow();
        if (tag === "textarea") {
            cls += " " + getTense(n, t);
            el.textContent = localStorage.getItem(n.format("YYYYMMDD-") + formatAmPm(t));
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
    if (n.isSame(t, "hour")) {
        cls = "present";
    } else if (n.isAfter(t)) {
        cls = "past"
    } else {
        cls = "future";
    }
    return cls;
}

function getTime24H(hour) { 
    return moment(hour, "H");
}
function getNow() { 
    return moment(); 
}
function formatAmPm(m) { 
    return m.format("hA");
}
