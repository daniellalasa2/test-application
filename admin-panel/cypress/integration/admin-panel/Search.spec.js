const reqOptions = {
  method: "GET",
  url: Cypress.env("EXTERNAL_API"),
  headers: {
    "content-type": "application/json"
  }
};
context("Listing", () => {
  describe("Page Load", () => {
    it("Component loaded successfuly and default search result displayed", () => {
      //Does component and default search result display?
      cy.visit("/listing");
      cy.contains("Admin Tool");
    });
  });
  describe("Search functionality and flow", () => {
    beforeEach(function() {
      //visit the page every each test units
      cy.visit("/listing");
    });
    it("Search box type behaviour is accurate and the result was filled successfuly into table", () => {
      //Does typing into search fields works?
      cy.get(".searchField-box .searchField")
        .type("p")
        .should("have.value", "p");
      // does search key word and page[size]=10 constant key word pushed into url field ?
      cy.request({ qs: { search: "p", "page[size]": "10" }, ...reqOptions })
        .its("body")
        .as("searchResult");
      //Is returned result from server same as data that generated in table info ?
      cy.get("@searchResult").then(resp => {
        if (resp.included) {
          const api_length = resp.included.length;
          const type = resp.included[0].type;
          const label = resp.included[0].attributes.label;
          const resultCount = resp.meta.total_entries;
          //Result count checking
          cy.get(".Search .dataInfoTable-section .resultCount").contains(
            resultCount
          );
          //table rows generating check
          cy.get(".Search .dataInfoTable-section table tbody tr").as("rows");
          cy.get("@rows").should("have.length", api_length);
          //table value inside td's checking
          cy.get("@rows").find(`td.${type}`);
          cy.get("@rows")
            .find("td.name")
            .contains(label);
        }
      });
    });
    it("Url updated based on user search phrase", () => {
      //Does Url of the page update successfuly after every success search result?
      cy.get(".searchField-box .searchField").type("per");
      cy.url().should("include", "?search=per");
    });
  });

  describe("Pagination functionality", () => {
    //check if all pagination elemets loaded perfect or not
    it("All pagination elements generates successfuly based on search result", () => {
      //send a base request
      cy.visit("/listing?search=p&page[size]=10");
      //send request to compare with generated UI
      cy.request({ qs: { search: "p", "page[size]": "10" }, ...reqOptions })
        .its("body")
        .as("searchResult");

      cy.get("@searchResult").then(resp => {
        if (resp.meta) {
          const totalPages = resp.meta.total_pages;
          const currentPage = resp.meta.current_page;
          //Store pagination elements
          cy.get(
            ".Search .tablePagination-section .pageButton-wrapper span"
          ).as("paginationElements");
          //generated pagination button must have an equal length to the totalPages that came from API result
          cy.get("@paginationElements").should("have.length", totalPages);
          //check if current requestd page is active in pageination section or not!
          cy.get("@paginationElements")
            .find(".active")
            .contains(currentPage);
        }
      });
    });
    it("Pagination buttons work great", () => {
      cy.visit("/listing?search=p&page[size]=10");
      //select all span pagination elements
      cy.get(".Search .tablePagination-section .pageButton-wrapper span").as(
        "paginationElements"
      );
      //If a pagination element was clicked , Would it take .active class ?
      cy.get("@paginationElements")
        .eq(2) //child counting starts from 0
        .click()
        .then($span => {
          cy.get($span)
            .find("button")
            .should("have.class", "active");
        });
      //grap result of server with page[number] param
      cy.request({
        qs: { search: "p", "page[size]": "10", "page[number]": "3" },
        ...reqOptions
      })
        .its("body")
        .as("searchResult");
      cy.get("@searchResult").then(resp => {
        if (resp.included) {
          const type = resp.included[0].type;
          const label = resp.included[0].attributes.label;
          //Select the first row of table info to compare data with
          cy.get(
            ".Search .dataInfoTable-section table tbody tr:first-child"
          ).as("firstTableRow");
          //check if clicked oagination button loads accurate table info
          cy.get("@firstTableRow").find(`td.${type}`);
          cy.get("@firstTableRow")
            .find("td.name")
            .contains(label);
        }
      });
    });
    //url must updates after pagination
    it("Url updates successfuly rely on page number", () => {
      cy.visit("/listing?search=h");
      cy.get(".Search .tablePagination-section .pageButton-wrapper span").as(
        "paginationElements"
      );
      //If a pagination element was clicked , Would it take .active class ?
      cy.get("@paginationElements")
        .eq(2)
        .click();
      //Does Url contain page number details ?
      cy.url().should("include", "?search=h&page[size]=10&page[number]=3");
    });
  });

  //Soring Tests
  describe("Sorting functionality", () => {
    it("Sort button works great and shows accurate result and updates Url sucessfuly", () => {
      cy.visit("/listing?search=h&page[size]=10");
      //Grab and alias sort button
      cy.get(".Search .dataInfoTable-section table thead .sort").as(
        "sortButton"
      );
      //Does sort button clickable?
      //Click on sort button must toggles table info alphabeticaly
      cy.get("@sortButton").click();
      //Send a requet to api with default params
      //default sort direction after page load is ASC
      //So request to api with a reverse sort direction
      cy.request({
        qs: {
          search: "h",
          "page[size]": "10",
          sort_direction: "desc",
          sort_type: "label"
        },
        ...reqOptions
      })
        .its("body")
        .as("sortResult");
      //Check if returned data is equal with generated table info rows or not !
      cy.get("@sortResult").then(resp => {
        if (resp.included) {
          const type = resp.included[0].type;
          const label = resp.included[0].attributes.label;
          //Select the first row to compare data
          cy.get(
            ".Search .dataInfoTable-section table tbody tr:first-child"
          ).as("firstTableRow");
          //Compare the first child of returned api data with the first row of table info and check if it's equal or not
          cy.get("@firstTableRow").find(`td.${type}`);
          cy.get("@firstTableRow")
            .find("td.name")
            .contains(label);
        }
        //Url update after sorting must wokrs
        cy.url().should(
          "include",
          "?search=h&page[size]=10&sort_direction=desc&sort_type=label"
        );
      });
    });
  });
});
