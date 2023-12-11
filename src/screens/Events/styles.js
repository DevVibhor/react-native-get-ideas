import {StyleSheet} from 'react-native';
import fonts from '../../assets/fonts/fonts';
import colors from '../../utils/colors';

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: colors?.primaryColor,
  },
  titleStyle: {
    width: '100%',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 22,
    fontFamily: fonts?.latoBlack,
    color: colors?.white,
  },
  backButtonStyle: {
    width: 25,
    height: 25,
  },
  eventTitle: {
    fontSize: 20,
    color: colors?.black,
    fontFamily: fonts?.latoBold,
    paddingLeft: 10,
  },
  eventDateTime: {
    fontSize: 16,
    color: colors?.transparentBlack,
    fontFamily: fonts?.latoRegular,
    paddingLeft: 10,
    paddingTop: 15,
  },
  tickContainer: {
    width: 30,
    height: 30,
    backgroundColor: colors?.green,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  deleteContainer: {
    width: 30,
    height: 30,
    backgroundColor: colors?.red,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickIcon: {
    width: 18,
    height: 18,
  },
  cardContainer: {
    width: '90%',
    paddingVertical: 15,
    backgroundColor: colors?.white,
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
  },
  imageContainer: {
    flexDirection: 'column',
    width: '10%',
    alignSelf: 'center',
  },
  noActiveEvents: {
    textAlign: 'center',
    fontFamily: fonts?.latoLight,
    fontSize: 18,
  },
  noActiveContainer: {
    width: '50%',
    alignSelf: 'center',
    marginTop: 30,
  },
  completedEventsView: {marginTop: 50, width: '100%', alignSelf: 'center'},
  completedEventsText: {
    fontSize: 20,
    color: colors?.black,
    fontFamily: fonts?.latoRegular,
    left: 25,
  },
  permissionAccessView: {
    alignSelf: 'center',
    width: '100%',
    alignContent: 'center',
    justifyContent: 'center',
    height: '90%',
  },
  deniedCalendarText: {
    fontSize: 18,
    textAlign: 'center',
    color: colors?.white,
    fontFamily: fonts?.latoBold,
  },
  goToSettingsText: {
    fontSize: 22,
    textAlign: 'center',
    color: colors?.black,
    textDecorationLine: 'underline',
    fontFamily: fonts?.latoRegular,
    marginTop: 10,
  },
  headerStyle: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 15,
  },
});

export default styles;
