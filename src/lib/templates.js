import * as types from './types';

const hasPrimitiveType = (element) => element.type !== 'object';

export const Element = (element) => (element.qty === 'single' ? SingleElement(element) : List(element));

export const SingleElement = (element) =>
	`<xs:element name="${element.name}" type="${types[element.type]}"${hasPrimitiveType(element)
		? '/>'
		: `>
      ${ComplexType(element.props)}
    </xs:element>
  `}`;

export const ComplexType = (elements) =>
	`<xs:complexType>
    <xs:sequence>
        ${elements.map(Element).join('')}
    </xs:sequence>
  </xs:complexType>`;

export const List = (element) =>
  `<xs:element name="${element.name}" type="${types[element.type]}" minOccurs="0" maxOccurs="unbounded"${hasPrimitiveType(
      element
    )
      ? '/>'
      : `>
        ${ComplexType(element.props)}
      </xs:element>
    `}`;

export const IO = (ios, targetType) =>
	`<?xml version="1.0" encoding="utf-8"?>
    <xs:schema xmlns="http://tempuri.org/XMLSchema1.xsd" xmlns:mstns="http://tempuri.org/XMLSchema1.xsd" xmlns:xs="http://www.w3.org/2001/XMLSchema" id="XMLSchema1" targetNamespace="http://tempuri.org/XMLSchema1.xsd" elementFormDefault="qualified">
        <xs:element name="${targetType}s" type="xs:complexType">
            <xs:complexType>
                <xs:sequence>
                    <xs:element name="${targetType}" type="xs:complexType">
                        <xs:complexType>
                            <xs:sequence>
                                ${ios.join('')}
                            </xs:sequence>
                        </xs:complexType>
                    </xs:element>
                    ${Error(targetType)}
                </xs:sequence>
            </xs:complexType>
        </xs:element>
    </xs:schema>`;

export const Error = (targetType) =>
	targetType === 'output'
		? `<xs:element name="error" type="xs:complexType">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="error" type="xs:string" />
              <xs:element name="success" type="xs:boolean" />
              <xs:element name="status" type="xs:integer" />
            </xs:sequence>
          </xs:complexType>
        </xs:element>`
		: '';
