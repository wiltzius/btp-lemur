/**
 * Created by tom on 7/10/17.
 */

import * as React from "react";
import InmateSearchForm from "./InmateSearchForm";
import InmateSearchDetails from "./InmateSearchDetails";

export default class InmateSearch extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      results: []
    }
  }

  render() {
    return <div id="inmateSearch">
      {/*<div class="inmateSearchForm"></div>*/}
        <InmateSearchForm onResultsChange={res => this.setState({results: res})} />
      <div id="searchResults">
        {this.state.results.map(res => <InmateSearchDetails key={res.id} inmate={res} />)}
      </div>
    </div>

  //   <div id="searchResults">
  //     {% if has_results %}
  //   <h2>Search Results</h2>
  //   <div class="resultsPadding">
  //
  //     <div class="pagination">
  //     <span class="current">
  //     Page {{ inmate_list.number }} of {{ inmate_list.paginator.num_pages }}:
  // </span>
  // {% if inmate_list.has_previous %}
  //   <a href="{% append_to_get page=inmate_list.previous_page_number %}">&lt; previous</a>
  // {% else %}
  // &lt; previous
  // {% endif %}
  // |
  // {% if inmate_list.has_next %}
  //   <a href="{% append_to_get page=inmate_list.next_page_number %}">next &gt;</a>
  // {% else %}
  // next &gt;
  // {% endif %}
  // </div>
  //
  // {% for inmate in inmate_list.object_list %}
  // {#          TODO  InmateSearchDetails goes here #}
  //   <div class=".inmateSearchDetails"></div>
  // {% empty %}
  //   <p><strong>No results found.</strong></p>
  //   <!-- link below is to the new inmate creation screen, but through an intermediary page (inmate-add-searched) that takes GET parameters with inmate information and pre-fills the form -->
  //   <p>If you are trying to start a new order, you'll first need to <a
  //     href="{% url 'inmate-add-searched' %}?{{ query }}">add the recipient to our database.</a> This happens if
  //     we've never sent them a package before.</p>
  // {% endfor %}
  //
  //   <div class="pagination">
  //         <span class="current">
  //             Page {{ inmate_list.number }} of {{ inmate_list.paginator.num_pages }}:
  //         </span>
  //     {% if inmate_list.has_previous %}
  //     <a href="{% append_to_get page=inmate_list.previous_page_number %}">&lt; previous</a>
  //     {% else %}
  //     &lt; previous
  //     {% endif %}
  //     |
  //     {% if inmate_list.has_next %}
  //     <a href="{% append_to_get page=inmate_list.next_page_number %}">next &gt;</a>
  //     {% else %}
  //     next &gt;
  //     {% endif %}
  //   </div>
  //
  // </div>
  // {% endif %}
  // </div>
  }

}
