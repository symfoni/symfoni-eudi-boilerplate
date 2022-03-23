import {AppMetadata, SessionTypes} from '@walletconnect/types';
import {Blockchain} from 'components/Blockchain';
import {Metadata} from 'components/Metadata';
import {useSymfoniContext} from 'context';
import React, {useEffect, useState} from 'react';
import {Button, ScrollView, StyleSheet, Text, View} from 'react-native';

interface RequestProps {
  request: SessionTypes.RequestEvent;
  onApprove: (
    event: SessionTypes.RequestEvent | SessionTypes.Proposal,
  ) => Promise<void>;
  onReject: () => Promise<void>;
}

export const RequestModal = (props: RequestProps) => {
  const {client} = useSymfoniContext();

  const {onApprove, onReject} = props;
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<AppMetadata | undefined>(undefined);
  const {topic, request, chainId} = props.request;

  useEffect(() => {
    const getMetadata = async () => {
      setLoading(true);
      try {
        if (typeof client === 'undefined') {
          return;
        }
        const session = await client.session.get(topic);
        setLoading(false);
        setMetadata(session.peer.metadata);
      } catch (e) {
        setLoading(false);
        console.warn(e);
      }
    };
    getMetadata();
  }, [client, topic]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{'JSON-RPC Request'}</Text>
      {loading ? (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionDescription}>{'Loading...'}</Text>
        </View>
      ) : metadata ? (
        <>
          <Metadata metadata={metadata} />
          {chainId && <Blockchain chainId={chainId} />}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{'Method'}</Text>
            <Text style={styles.sectionDescription}>{request.method}</Text>
            <Text style={styles.sectionTitle}>{'Params'}</Text>
            <Text style={styles.sectionDescription}>
              {JSON.stringify(request.params)}
            </Text>
          </View>
          <View style={styles.actions}>
            <Button title="Reject" onPress={() => onReject(props.request)} />
            <Button title="Approve" onPress={() => onApprove(props.request)} />
          </View>
        </>
      ) : (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionDescription}>
            {'Something went wrong'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 100,
    marginTop: 100,
    margin: 20,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: '#444',
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 30,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
