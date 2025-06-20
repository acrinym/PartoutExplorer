import { DATPARTOUT } from "./DATPARTOUT";
import * as EntryUtils from "./EntryUtils"
import { ImageEntry } from "./Entries/ImageEntry";
import { ZBufferEntry } from "./Entries/ZBufferEntry";
import { TextEntry } from "./Entries/TextEntry";

/**
 * Extracts the images from a DATPARTOUT file.
 * @param {DATPARTOUT} file The file.
 */
function imageList(file) {
    var listElm = document.createElement("div");
    var images = [];
    file.groups.forEach(function (group, groupID) {
        group.forEach(function (entry, entryID) {
            if (entry instanceof ImageEntry || entry instanceof ZBufferEntry) {
                images.push({
                    entry: entry,
                    entryID: entryID,
                    group: group,
                    groupID: groupID
                });
            }
        });
    });

    let message = "";
    let g = "";
    let counter = 1;

    images.filter(image => image.entry.tableSize === 2)
        .forEach(function (image) {
            let imageElm;
            if (image.entry instanceof ImageEntry) {
                imageElm = EntryUtils.paletteImgFromEntry(image.entry);
                /** @type {TextEntry[]} */
                const x = image.group.filter(e => e instanceof TextEntry);
                if (x.length > 0) {
                    const st = `{ name: "${x[0].text}", `;
                    message += st;
                    g = x[0].text;
                    counter = 1;
                } else {
                    message += `{ name: "${g}_${counter}", `;
                    counter++;
                }
                message += `group: ${image.groupID}, entry: ${image.entryID} }\n`;
            } else {
                imageElm = EntryUtils.zBufferImgFromEntry(image.entry);
            }
            imageElm.title = `${image.groupID}-${image.entryID}`;
            listElm.appendChild(imageElm);
        });

    console.log(message);

    return listElm;
}

var fileElm = document.getElementById("file");
var imagesElm = document.getElementById("images");

fileElm.onchange = function () {
    var f = fileElm.files[0],
        r = new FileReader();
    r.onload = function () {
        var DATFILE = new DATPARTOUT(r.result);
        imagesElm.innerHTML = "";
        imagesElm.appendChild(imageList(DATFILE));
    };
    r.readAsArrayBuffer(f);
};
