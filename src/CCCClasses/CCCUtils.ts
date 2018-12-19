import * as bootstrap from "bootstrap";
import * as $ from "jquery";

export function getLoadingSpinner(spinnername: string) : JQuery {
    var id = "loadspn-"+id;
	var exists = $("#"+id);
	if (exists.length > 0) {
		return exists;
	}
	else {
		return $("<i>")
			.addClass("fas")
			.addClass("fa-sync")
			.addClass("fa-spin")
			.attr("id", id);
	}
}

export type AlertTypes = 
    "alert-primary" |
    "alert-secoundary" |
    "alert-success"|
    "alert-danger"|
    "alert-warning" |
    "alert-info" |
    "alert-light" |
    "alert-dark";

/**
 * Returns a JQuery Object for a alert
 * @param alertClass Class of alert
 * @param headText Headertext for Alert
 * @param bodyText Bodytext for Alert
 */
export function getAlert(alertClass: AlertTypes, headText: string, bodyText: string) : JQuery {
    var alert = $("<div>")
		.addClass("alert")
        .addClass(alertClass);
        
	$("<h4>")
		.addClass("alert-heading")
		.html( headText )
		.appendTo(alert);
    alert.append(bodyText);
    
	return alert;
}

export function scrollTo(item: JQuery) : void {
    $("html, body").animate({
        scrollTop: item.offset().top
    }, 500);
}

export function confirm(title: string, message: string, yesCallback: ()=>void, noCallback: ()=>void) : void {
    var modalBtnClick = () => {
		if ($(this).attr("val") == "1") {
			if (yesCallback !== undefined)
                yesCallback();
		}
		else {
			if (noCallback !== undefined)
                noCallback();
		}
		modal.modal("hide");
	}

	var modal = $("#modal");
	$(".modal-title", modal).html(title);
	$(".modal-body", modal).text(message);
	$("#btnYes", modal)
		.attr("val", 1)
		.off("click")
		.click(modalBtnClick);
	$("#btnNo", modal)
		.attr("val", 0)
		.off("click")
		.click(modalBtnClick);
	modal.modal("show");
}

export function getCurrentTabURL() : Promise<string> {
	return new Promise((resolve, reject)=>{
		chrome.tabs.query({
			"active": true,
			"lastFocusedWindow": true
		}, (tabs)=>{
			if (tabs && tabs.length > 0) {
				resolve(tabs[0].url);
			}
			else {
				reject(chrome.runtime.lastError);
			}
		});
	});
}

export async function isCookieClickerPage() : Promise<boolean> {
	let url = await getCurrentTabURL();
	return url.indexOf("cookieclicker") != -1
}