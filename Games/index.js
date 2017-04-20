/*
 * Games container
 */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { debounce } from 'lodash';

import {
  gamesRequest,
  gamesSearch,
  toggleSearch,
  nextPageRequest,
  startSpinner,
} from './actions';

import selectGames from './selectors';

import GameCard from 'components/GameCard';

import { getGameURLFromId } from '../../utils/hashingFunction';

import s from './styles.css';

class Games extends Component {

  componentDidMount() {
    this.props.getGames();
    window.addEventListener('scroll', this.handleNextPageRequest);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleNextPageRequest);
  }

  handleNextPageRequest = () => {
    const { getNextPage, isFetching, isLastPage } = this.props;
    const query = this.searchInput.value;
    if (((window.innerHeight + window.scrollY) / document.body.scrollHeight) >= 0.99) {
      !isFetching && !isLastPage && getNextPage(query);
    }
  }

  handleSearch = debounce(this.props.gamesSearch, 300);

  render() {
    const { doc, games, search, isFetching, isSearching, isLastPage } = this.props;

    return (
      <main role="main" className={s.root}>
        <div className={s.top}>
          <h1>Games</h1>
          <div className={s.search}>
            <input
              type="text"
              onChange={(e) => {
                // TODO: erase this when the BE search is implemented
                this.props.dispatch(startSpinner());
                if (isSearching && e.target.value.trim()) {
                  this.handleSearch(e.target.value);
                } else {
                  !isSearching && this.handleSearch(e.target.value);
                  this.props.toggleSearch();
                }
              }}
              ref={input => this.searchInput = input} />
            <i className="icon-search" />
          </div>
        </div>
        <div className={s.games}>
          {(isSearching ? search : games).map((g, idx) => (
            <GameCard
              key={idx}
              idx={idx}
              gameID={g.id}
              title={g.name}
              studio={g.company}
              width={doc.width}
              makerCount={g.makerCount}
              makers={g.makers}
              imageSm={getGameURLFromId(g.id.toString(), '550x520')}
              imageLg={getGameURLFromId(g.id.toString(), '2500x300')} />
          ))}
          {!isFetching && !isSearching && games.length === 0 && <h3>There are no games to display</h3>}
          {isFetching &&
            <div>
              <h3>Loading</h3>
              <div className="loader">
                <div />
                <div />
                <div />
              </div>
            </div>}
          {isLastPage && <h3>No more results</h3>}
        </div>
      </main>
    );
  }
}

Games.propTypes = {
  doc: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }),
  isFetching: PropTypes.bool.isRequired,
  isSearching: PropTypes.bool.isRequired,
  isLastPage: PropTypes.bool.isRequired,
  games: PropTypes.array.isRequired,
  search: PropTypes.array.isRequired,
  message: PropTypes.string.isRequired,
  getGames: PropTypes.func.isRequired,
  gamesSearch: PropTypes.func.isRequired,
  toggleSearch: PropTypes.func.isRequired,
  getNextPage: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(
  selectGames(),
  dispatch => ({
    dispatch,
    getGames: () => dispatch(gamesRequest()),
    gamesSearch: query => dispatch(gamesSearch(query)),
    toggleSearch: () => dispatch(toggleSearch()),
    getNextPage: query => dispatch(nextPageRequest(query)),
  })
)(Games);
