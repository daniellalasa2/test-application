import React from "react";
import "./Search.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faSortDown,
  faSortUp,
  faKey,
  faChalkboard,
  faArrowLeft,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import { Table } from "reactstrap";
import { GetSearchResult, SafeValue } from "../ApiHandler/ApiHandler";
import Spinner from "../Tools/Spinner/Spinner";
import Header from "../Layout/Header";
import classnames from "classnames";
import UpdateAndReturnAUrlString from "../Tools/UpdateParams/UpdateParams";
export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalEntries: 0,
      sort: "asc",
      tableInfoData: [],
      isUserSearching: false,
      searchPhrase: "",
      pageSize: 10,
      pagination: {
        current_page: 1,
        next_page: null,
        prev_page: null,
        total_entries: 0,
        total_pages: 1
      },
      staticUrlParams: { "page[size]": 10 }
    };
    this.searchInput = React.createRef();
  }
  //if you send a value to this function as second argument this operation called force search

  doSearch = (searchElement, params = {}) => {
    const { staticUrlParams, sort } = this.state,
      { search } = window.location,
      urlSearchPhrase = params.search
        ? params.search
        : SafeValue(this.urlParser(search), "search", "string", ""),
      urlSort = params.sort_direction ? params.sort_direction : sort;
    let paramString = "";
    //If user starts typing into search bar
    if (SafeValue(searchElement, "", "object", false)) {
      //operation goes here only when user starts typing
      params.search = searchElement.target.value;
      params = { search: params.search, ...staticUrlParams };
      paramString = UpdateAndReturnAUrlString(params, "");
    }
    //Other situtations
    else {
      params = {
        ...params,
        ...staticUrlParams
      };
      this.searchInput.current.value = urlSearchPhrase;
      paramString = UpdateAndReturnAUrlString(params, search);
    }
    this.setState({ isUserSearching: true });
    GetSearchResult(paramString, item => {
      if (item.success_result.success) {
        this.setState(
          {
            tableInfoData: SafeValue(item, "data.included", "object", []),
            searchedValue: params.search,
            sort: urlSort,
            isUserSearching: false,
            pagination: SafeValue(item, "data.meta", "object", {})
          },
          () => this.updateUrl(paramString)
        );
      }
    });
  };
  generateTableInfo = () => {
    const { tableInfoData } = this.state;
    const rows = [];
    let name, art;
    if (tableInfoData.length > 0) {
      tableInfoData.forEach((info, idx) => {
        name = SafeValue(info, "attributes.label", "string", "No Specified");
        //if data of art was not reliable and true then return a default icon
        art = SafeValue(
          info,
          "type",
          "string",
          <FontAwesomeIcon icon={faSortDown} size="1x" color="whitesmoke" />
        );
        rows.push(
          <tr key={idx}>
            <td className={art}>
              {art === "authorization_roles" ? (
                <FontAwesomeIcon icon={faKey} size="lg" color="grey" />
              ) : (
                <FontAwesomeIcon icon={faChalkboard} size="lg" color="grey" />
              )}
            </td>
            <td className="name">{name}</td>
          </tr>
        );
      });
    } else {
      rows.push(
        <tr key={0}>
          <td style={{ border: "none" }}>&nbsp;</td>
          <td>
            <span style={{ marginLeft: "39%" }}>Kein Ergebnis</span>
          </td>
        </tr>
      );
    }
    return rows;
  };
  generatePaginationItems = () => {
    const { total_pages, current_page, total_entries } = this.state.pagination;
    const generatedItems = [];
    if (total_entries > 0) {
      for (let i = 1; i <= total_pages; i++) {
        generatedItems.push(
          <span
            key={i}
            className="pageButton"
            onClick={() => current_page !== i && this.doPagination(null, i)}
          >
            <button className={classnames(current_page === i && "active")}>
              {i}
            </button>
          </span>
        );
      }
    }
    return generatedItems;
  };

  updateUrl = newSearch => {
    this.props.history.push(newSearch);
  };
  doSort = type => {
    let { sort } = this.state;
    //reversing sort direction
    switch (sort) {
      case "asc":
        sort = "desc";
        break;
      case "desc":
        sort = "asc";
        break;
      default:
        break;
    }
    this.doSearch(null, { sort_direction: sort, sort_type: type });
  };
  doPagination = (type, page) => {
    const { pageSize } = this.state;
    let { next_page, prev_page } = this.state.pagination,
      pagination;
    switch (type) {
      case "next":
        pagination = next_page;
        break;
      case "prev":
        pagination = prev_page;
        break;
      default:
        pagination = page;
    }
    this.doSearch(null, {
      "page[number]": pagination,
      "page[size]": pageSize
    });
  };
  urlParser = url => {
    const params = new URLSearchParams(url);
    const paramsObj = {};
    for (const [key, value] of params.entries()) {
      paramsObj[key] = value;
    }
    return paramsObj;
  };
  componentDidMount() {
    this.doSearch(null, this.urlParser(window.location.search));
  }

  render() {
    const { isUserSearching, pagination, sort, searchPhrase } = this.state;
    return (
      <div className="Search">
        {/* Search Section Elements */}
        <Header>
          <div className="logoTitle-box">
            <strong className="logoTitle">Admin Tool</strong>
          </div>
          <div className="searchField-box">
            <span className="searchIcon-wrapper">
              <FontAwesomeIcon
                icon={faSearch}
                pull="left"
                size="lg"
                color="whitesmoke"
              />
            </span>
            <input
              type="text"
              className="searchField"
              onChange={this.doSearch}
              ref={this.searchInput}
            />
            <span
              className={classnames(
                "searchButton-wrapper",
                !isUserSearching && "active"
              )}
            >
              <button
                disabled={isUserSearching}
                onClick={() => this.doSearch()}
              >
                {isUserSearching ? <Spinner /> : "SUCHEN"}
              </button>
            </span>
          </div>
          <div className="addNewRecord-box">
            <span
              className="addNewRecord"
              onClick={() => this.props.history.push("/addnewrecord")}
            >
              +
            </span>
          </div>
        </Header>

        {/* Body Section */}
        <div className="searchBody-section">
          <div className="menu-section">Filter Section</div>
          <div className="contentBody-section">
            <div className="dataInfoTable-section">
              <span className="resultCount">
                {pagination.total_entries} Ergebnisse gefunden
              </span>
              <Table>
                <thead>
                  <tr>
                    <th>Art</th>
                    <th onClick={() => this.doSort("label")} className="sort">
                      Name{" "}
                      {sort === "asc" ? (
                        <FontAwesomeIcon icon={faSortDown} size="1x" />
                      ) : (
                        <FontAwesomeIcon icon={faSortUp} size="1x" />
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody>{this.generateTableInfo()}</tbody>
              </Table>
              <div className="tablePagination-section">
                <span
                  onClick={() => this.doPagination("prev")}
                  className={classnames(
                    "prev",
                    "navigation",
                    pagination.prev_page === null && "deactive"
                  )}
                >
                  <FontAwesomeIcon icon={faArrowLeft} size="1x" pull="left" />
                  Vorherige
                </span>
                <div className="pageButton-wrapper">
                  {this.generatePaginationItems()}
                </div>
                <span
                  onClick={() => this.doPagination("next")}
                  className={classnames(
                    "prev",
                    "navigation",
                    pagination.next_page === null && "deactive"
                  )}
                >
                  <FontAwesomeIcon icon={faArrowRight} size="1x" pull="right" />
                  Nächste
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
