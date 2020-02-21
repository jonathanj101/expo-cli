import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, Button, StyleSheet } from 'react-native';
import { Card, Icon, Rating, AirbnbRating, Input } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';

const mapStateToProps = state => {
  return {
    campsites: state.campsites,
    comments: state.comments,
    favorites: state.favorites,
  };
};

const mapDispatchToProps = {
  postFavorite: campsiteId => (postFavorite(campsiteId)),
  postComment: (campsiteId, rating, author, text) => (postComment(campsiteId, rating, author, text)),
};

function RenderCampsite(props) {

  const { campsite } = props;
  if (campsite) {
    return (
      <Animatable.View animation='fadeInDown' duration={2000} delay={1000}>
        <Card
          featuredTitle={campsite.name}
          image={{ uri: baseUrl + campsite.image }}>
          <Text style={{ margin: 10 }}>
            {campsite.description}
          </Text>
          <View style={styles.cardRow}>
            <Icon
              name={props.favorite ? 'heart' : 'heart-o'}
              type='font-awesome'
              color='#f50'
              raised
              reverse
              onPress= {() => props.favorite ?
        console.log('Already set as a favorite') : props.markFavorite()}
            />
            <Icon
              name='pencil'
              type='font-awesome'
              style={styles.cardItem}
              color='#5637DD'
              raised
              reverse
              onPress={() => props.onShowModal()}
            />
          </View>
        </Card>
      </Animatable.View>
    );
  }

  return <View />;
}

function RenderComments({ comments }) {

  const renderCommentItem = ({ item }) => {
    return (
      <View style={{ margin: 10 }}>
      <Text style={{ fontSize: 14 }}>{item.text}</Text>
        <AirbnbRating reviews={false} isDisabled starContainerStyle={{ paddingBottom: 40, alignSelf: 'flex-start' }} defaultRating={item.rating} size={15} />
        {/*<Rating readonly style={{ alignItems: 'flex-start', paddingVertical: '5%' }} startingValue={item.rating} imageSize={15} />*/}
        <Text style={{ fontSize: 12 }}>{`-- ${item.author}, ${item.date}`}</Text>
      </View>
    );
  };

  return (
    <Animatable.View animation='fadeInDown' duration={2000} delay={1000}>
      <Card title='Comments'>
      <FlatList
        data={comments}
        renderItem={renderCommentItem}
        keyExtractor={item => item.id.toString()}
      />
      </Card>
    </Animatable.View>
  );
}

class CampsiteInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 5,
      author: '',
      text: '',
      showModal: false,
    };
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  handleComment(campsiteId) {
    this.props.postComment(campsiteId, this.state.rating, this.state.author, this.state.text);
    this.toggleModal();
  }

  resetForm() {
    this.setState({
      rating: 5,
      author: '',
      text: '',
      showModal: false,
    });
  }

  markFavorite(campsiteId) {
    this.props.postFavorite(campsiteId);
  }

  static navigationOptions = {
      title: 'Campsite Information',
    };

  render() {
    const campsiteId = this.props.navigation.getParam('campsiteId');
    const campsite = this.props.campsites.campsites.filter(campsite => campsite.id === campsiteId)[0];
    const comments = this.props.comments.comments.filter(comment => comment.campsiteId === campsiteId);
    return (
      <ScrollView>
        <RenderCampsite campsite={campsite}
          favorite={this.props.favorites.includes(campsiteId)}
          markFavorite={() => this.markFavorite(campsiteId)}
          onShowModal={() => this.toggleModal()}
        />
        <RenderComments comments={comments}
        />
        <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.showModal}
          onRequestClose={() => this.toggleModal()}
        >
          <View style={styles.modal}>
          {/*  Rating   */}
            {/*<Rating
                showRating
                //type='star'
                //fraction={0}
                startingValue={this.state.rating}
                imageSize={40}
                onFinishRating={(rating)=>this.setState({ rating: rating })}
                style={{ paddingVertical: 10 }}
            />*/}
             <AirbnbRating
              count={5}
              reviews={['BAD', 'OKAY', 'GOOD', 'GREAT', 'EXCELLENT']}
              defaultRating={this.state.rating}
              onFinishRating={(rating)=>this.setState({ rating: rating })}
              size={40}
            />

            <Input
              placeholder='Author'
              leftIcon={{ type: 'font-awesome', name: 'user-o' }}
              leftIconContainerStyle={{ paddingRight: 10 }}
              onChangeText={(author=>this.setState({ author: author }))}
              style={{ paddingVertical: 10 }}
              value={this.state.author}
            />
            <Input
              placeholder='Comment'
              leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
              leftIconContainerStyle={{ paddingRight: 10 }}
              onChangeText={(text=>this.setState({ text: text }))}
              style={{ paddingVertical: 10 }}
              value={this.state.text}
            />
            <View style={{ marginTop: 10 }}>
              <Button
                title='Submit'
                color='#5637DD'
                onPress={() => {
                  this.handleComment(campsiteId);
                  this.resetForm();
                }}

              />
              <View style={{ margin: 10 }}>
              <Button
              onPress={() => {
                this.toggleModal();
                this.resetForm();
              }}

              color='#808080'
              title='Cancel'
              />
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  cardRow: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    margin: 20,
  },
  cardItem: {
    flex: 1,
    margin: 10,
  },
  modal: {
    justifyContent: 'center',
    margin: 20,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo);
