import Menu from './MenuComponent';
import Home from './HomeComponent';
import React, { Component } from 'react';
import DishDetail from "./DishdetailComponent";
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Contact from './ContactComponent';
import About from './AboutComponent';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { postComment, fetchDishes, fetchPromos, fetchComments, fetchLeaders, postFeedback } from '../redux/ActionCreators';
import { actions } from 'react-redux-form';
import { TransitionGroup, CSSTransition } from 'react-transition-group'
// import { Loading} from './LoadingComponent';
// changing from function to class component
// function App() {
// main component will be the responsible for the state of application
// this function will allow these compoent to main as props
const mapStateToProps = (state) => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        promotions: state.promotions,
        leaders: state.leaders
    };
}

// dispatch parameter is received from store
const mapDispatchToProps = (dispatch) => ({
    // these parameters are passed as parameter of addComments, then dispatch
    // so here actioncreator add commment will return an action object for addign a comment
    // then it is given as parameter to the dispatch function
    // then we are supplying as a function, which can be used as a component here
    postComment: (dishID, rating, author, comment) => dispatch(postComment(dishID, rating, author, comment)),
    fetchDishes: () => { dispatch(fetchDishes()) },
    // this will reset feedback form 
    resetFeedbackForm: () => { dispatch(actions.reset('feedback')) },
    fetchComments: () => dispatch(fetchComments()),
    fetchPromos: () => dispatch(fetchPromos()),
    fetchLeaders: () => dispatch(fetchLeaders()),
    postFeedback: (firstname, lastname, telnum, email, agree, contactType, message) =>
        dispatch(postFeedback(firstname, lastname, telnum, email, agree, contactType, message))
});

class Main extends Component {
    // in the main component I need to fetch the dishes. So, where do I fetch the dishes? So, this is where I can take the help of the lifecycle method of my component called as componentDidMount. Now, this lifecycle method, whatever we include in this lifecycle method component will bound will be called or will be executed just after this component gets mounted into the view of my application. So, right at the point this would be called. That is a very good time for me to fetch any data that I require for my application. 
    componentDidMount() {
        this.props.fetchDishes();
        this.props.fetchComments();
        this.props.fetchPromos();
        this.props.fetchLeaders();
    }

    render() {
        const HomePage = () => {
            return (
                // displaying only dish which are featured
                // loading and errormsg parameter
                <Home
                    dish={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
                    dishesLoading={this.props.dishes.isLoading}
                    dishErrMess={this.props.dishes.errMess}
                    promotion={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
                    promoLoading={this.props.promotions.isLoading}
                    promoErrMess={this.props.promotions.errMess}
                    leader={this.props.leaders.leaders.filter((leader) => leader.featured)[0]}
                    leaderLoading={this.props.leaders.isLoading}
                    leaderErrMess={this.props.leaders.errMess}
                />
            );
        }

        // method a params from route
        // it consist of parameter as dishId
        const DishWithId = ({ match }) => {
            return (
                // match.params.dishId - accessing the dishId from params
                // 10 is the redix od decimal number

                // passing the function as a props
                <DishDetail dish={this.props.dishes.dishes.filter((dish) => dish.id === parseInt(match.params.dishId, 10))[0]}
                    isLoading={this.props.dishes.isLoading}
                    errMess={this.props.dishes.errMess}
                    comments={this.props.comments.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId, 10))}
                    commentsErrMess={this.props.comments.errMess}
                    postComment={this.props.postComment}
                />
            );
        }

        return (
            <div>
                <Header />
                <TransitionGroup>
                    <CSSTransition key={this.props.location.key} classNames="page" timeout={300}>
                        <Switch location={this.props.location}>
                            {/* here we are giving pathname and Homepage Component */}
                            <Route path="/home" component={HomePage} />
                            {/* this Route will not allow us to pasa ny props into menu component */}
                            {/* so we have to pass the props as an function component */}
                            <Route exact path="/menu" component={() => <Menu dishes={this.props.dishes} />} />
                            {/* here Route returns 3 prams that we use in DishWithId */}
                            <Route path="/menu/:dishId" component={DishWithId} />
                            <Route exact path='/contactus' component={() => <Contact resetFeedbackForm={this.props.resetFeedbackForm} postFeedback={this.props.postFeedback} />} />
                            <Route exact path="/aboutus" component={() => <About leaders={this.props.leaders.leaders} />} />
                            {/* if no path matches then redirect to home page */}
                            <Redirect to="/home" />
                        </Switch>
                        {/* using menu component from MenuComponent */}
                        {/* passing the dishes details as props */}
                        {/* < Menu dishes={this.state.dishes} onClick={(dishId) => this.onDishSelect(dishId)} /> */}
                        {/* filter will compare from each dish and get the maching dish with dishId */}
                        {/* filter will pass the result in array format */}
                        {/* so just to be safe we are selecting the first dish */}
                        {/* <DishDetail dish={this.state.dishes.filter((dish) => dish.id === this.state.selectedDish)[0]} /> */}
                    </CSSTransition>
                </TransitionGroup>
                <Footer />
            </div >
        );
    }
}

// connecting to redux
// to make use of react router 
// connect should be surround by withRouter
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
