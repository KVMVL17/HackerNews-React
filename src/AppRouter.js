import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Header from "./components/headers/Header";
import ContribIndex from "./components/contributions/ContribIndex";
import ContribShow from "./components/contributions/ContribShow";
import UserShow from "./components/users/UserShow";
import ContribForm from "./components/contributions/ContribForm";
import CommentsIndex from "./components/comments/CommentsIndex";
import CommentShow from "./components/comments/CommentShow";
import ReplyShow from "./components/replies/ReplyShow";
import MyProfile from "./components/users/MyProfile";
import ContribEdit from "./components/contributions/ContribEdit";
import CommentEdit from "./components/comments/CommentEdit";


const AppRouter = () => {
    return (
        <Router>
            <Header />
            <Route exact path="/" component={ContribIndex}/>
            <Route exact path="/contributions" component={ContribIndex} />
            <Route exact path="/contributions/:id" component={ContribShow} />
            <Route exact path="/contributions/:id/edit" component={ContribEdit} />
            <Route exact path="/newest" component={ContribIndex} />
            <Route exact path="/ask" component={ContribIndex} />
            <Route exact path="/users/:id" component={UserShow} />
            <Route exact path="/replies/:id" component={ReplyShow} />
            <Route exact path="/submit" component={ContribForm}/>
            <Route exact path="/upvoted/contributions" component={ContribIndex}/>
            <Route exact path="/upvoted/comments" component={CommentsIndex}/>
            <Route exact path="/contributions/users/:id" component={ContribIndex}/>
            <Route exact path="/comments/users/:id" component={CommentsIndex}/>
            <Route exact path="/comments/:id" component={CommentShow}/>
            <Route exact path="/comments/:id/edit" component={CommentEdit}/>
            <Route exact path="/myProfile" component={MyProfile}/>

        </Router>
    );
};

export default AppRouter;
