import React from 'react';
import InmateSearchResult from './InmateSearchResult';


export default class InmateSearchResults extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {

  }

  /* Pagination
  <div class="pagination">
          <span class="current">
              Page {{inmate_list.number }} of {{inmate_list.paginator.num_pages }}:
          </span>
          {% if inmate_list.has_previous %}
          <a href="{% append_to_get page=inmate_list.previous_page_number %}">&lt; previous</a>
          {% else %}
          &lt; previous
          {% endif %}
          |
          {% if inmate_list.has_next %}
          <a href="{% append_to_get page=inmate_list.next_page_number %}">next &gt;</a>
          {% else %}
          next &gt;
          {% endif %}
        </div>
   */

  /* Bottom pagination
  <div class="pagination">
          <span class="current">
              Page {{inmate_list.number }} of {{inmate_list.paginator.num_pages }}:
          </span>
          {% if inmate_list.has_previous %}
          <a href="{% append_to_get page=inmate_list.previous_page_number %}">&lt; previous</a>
          {% else %}
          &lt; previous
          {% endif %}
          |
          {% if inmate_list.has_next %}
          <a href="{% append_to_get page=inmate_list.next_page_number %}">next &gt;</a>
          {% else %}
          next &gt;
          {% endif %}
        </div>
   */

  /*
  empty state:
  <p><strong>No results found.</strong></p>
        <!-- link below is to the new inmate creation screen, but through an intermediary page (inmate-add-searched) that takes GET parameters with inmate information and pre-fills the form -->
        <p>If you are trying to start a new order, you'll first need to <a
            href="{% url 'inmate-add-searched' %}?{{ query }}">add the recipient to our database.</a> This happens if
          we've never sent them a package before.</p>
   */

  render() {
    // todo: only visible if inmate results are present
    return <div id="searchResults">
      <h2>Search Results</h2>
      <div class="resultsPadding">
        {this.props.map(inmate => <InmateSearchResult inmate={inmate} />)}
      </div>
    </div>
  }

}
